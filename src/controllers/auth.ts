'use strict';

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const User = require('../models/user');
const Client = require('../models/client');
const Token = require('../models/token');

/**
* Used to authenticate a client 
**/
passport.use(new BasicStrategy(
	function(id, secret, callback){
    let query = {id : id};
		Client.findOne(query, function(err, client){
			if(err){
        return callback(err);
      } 

      if(!client){
        return callback(null, false);
      } 
			
			client.verifySecret(secret, function(err, isMatch){
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
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token)  {
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
        Token.findByIdAndRemove(token._id, function(err){
          if(err){
            return callback(err);
          } 

          return callback(null, false); 
          //on client side: redirect to oauth/token with grant_type = refresh_token and the refresh token
        });

      }else{
          if(token.userId !== null){

            User.findOne({ _id: token.userId }, function (err, user) {
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

const isAuthenticated = passport.authenticate('basic', {session: false});
const isBearerAuthenticated = passport.authenticate('bearer', {session: false});

module.exports = {
  isAuthenticated,
  isBearerAuthenticated
};
