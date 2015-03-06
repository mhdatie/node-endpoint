var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');


passport.use(new BasicStrategy(
	function(username, password, callback){
		var query = {username : username};
		User.findOne(query, function(err, user){
			if(err) {return callback(err);}

			if(!user) {return callback(null, false);}

			user.verifyPassword(password, function(err, isMatch){
				if(err) {return callback(err);}
				if(!isMatch) {return callback(null, false);}
				return callback(null, user);
			});
		});
	}
));

//and of type ADMIN, to skip the promt part.
passport.use(new BasicStrategy(
	function(username, password, callback){
		var query = {id : username};
		Client.findOne(query, function(err, client){
			if(err) return callback(err);
			
			//todo: verify password instead/bcrypt password on pre save
			if(!client || client.secret !== password) return callback(null, false);

			return callback(null, client);
		})
	}
));

/**
* Later, this will be used to allow clients who are of type ADMIN to get an access token
* Third party apps/users should not be allowed to have a client ID:Secret, for now.
**/
passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope for full access
        callback(null, user, { scope: '*' }); //define scope later
      });
    });
  }
));


exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], {session: false});
exports.isClientAuthenticated = passport.authenticate('client-basic', {session: false});
exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false});