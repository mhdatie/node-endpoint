'use strict';
import {Client} from "../models/client";
import {Token} from "../models/token";
import {User} from "../models/user";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;


/**
* Used to authenticate a client 
**/
passport.use(new BasicStrategy(
	(id, secret, callback) => {
    let query = {id : id};
		Client.findOne(query, (err, client) => {
			if(err){
        return callback(err);
      } 

      if(!client){
        return callback(null, false);
      } 
			
      client.verifySecret(secret, (err, isMatch) => {
        if(err){
          return callback(err);
        } 
        if(!isMatch){
          return callback(null, false);
        }
        return callback(null, client);
    
      });

    });
	}
));


/**
* Used to validate an access token for a user.
**/
passport.use(new BearerStrategy(
  (accessToken, callback) => {
    Token.findOne({value: accessToken }, (err, token) => {
      if (err){
        return callback(err); 
      } 

      // No token found
      if (!token){
        return callback(null, false);
      }

      //check expiry
      if(new Date() > token.expirationDate){

        //delete token
        Token.findByIdAndRemove(token._id, (err) => {
          if(err){
            return callback(err);
          } 

          return callback(null, false); 
          //on client side: redirect to oauth/token with grant_type = refresh_token and the refresh token
        });

      }else{
          if(token.userId !== null){

            User.findOne({ _id: token.userId },  (err, user) => {
              if (err){
                return callback(err);
              } 

              // No user found
              if (!user){
               return callback(null, false);
              }

              // Simple example with no scope for full access
              callback(null, user, { scope: '*' }); //define scope later
            });

          }
      }
    });
  }
));

export const isAuthenticated = passport.authenticate('basic', {session: false});
export const isBearerAuthenticated = passport.authenticate('bearer', {session: false});