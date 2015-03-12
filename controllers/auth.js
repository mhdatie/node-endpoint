var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

/**
* Used to authenticate a client
**/
passport.use(new BasicStrategy(
	function(id, secret, callback){
		var query = {id : id};
		Client.findOne(query, function(err, client){
			if(err) return callback(err);

      if(!client) return callback(null, false);
			
			client.verifySecret(secret, function(err, isMatch){
        if(err) return callback(err);
        if(!isMatch) return callback(null, false);

        return callback(null, client);
    
      });

    });
	}
));

/**
* Used to validate an access token for the authorized user.
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
exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false});