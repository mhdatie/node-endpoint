'use strict';
/**
	This controller controls the flow of OAuth
**/
//move to helpers-------------------------------

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uid (len) {
  var buf = [];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

//------------------------------------------------

var config = require('../../config');
// Load required packages
var oauth2orize = require('oauth2orize');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var RefreshToken = require('../models/refreshtoken');

//create OAuth 2.0 server
var server = oauth2orize.createServer();

//Register Serialization
server.serializeClient(function(client, callback){
	return callback(null, client._id);
});
//Register Deserialization
server.deserializeClient(function(id, callback){
	Client.findOne({ _id : id }, function(err, client){
		if(err){
		 return callback(err);
		}
		return callback(null, client);
	});
});

/**
* Exchange user id and password for access tokens.
*
* The callback accepts the `client`, which is exchanging the user's name and password
* from the token request for verification. If these values are validated, the
* application issues an access token on behalf of the user who authorized the code.
*/
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {

	User.findOne({username : username}, function(err, user){
		if(err){
			return done(err);
		} 

		if(!user){
			return done(null, false);
		} 

		user.verifyPassword(password, function(err, isMatch){
			if(err){
				return done(err);
			} 

			if(!isMatch){
				return done(null, false);
			} 
			
			var value = uid(config.token.accessTokenLength);

			var token = new Token();

			token.value = value;
			token.userId = user._id;
			token.clientId = client._id;
			token.expirationDate = config.token.calculateExpirationDate();
			if(scope && scope.indexOf('offline_access') !== -1){
				token.scope = scope;
			}
			
			token.save(function (err) {
				if (err) {
					return done(err);
				}

				var refreshToken = null;

				if(scope && scope.indexOf('offline_access') !== -1){
					var refreshValue = uid(config.token.refreshTokenLength);
					refreshToken = new RefreshToken();
				
					refreshToken.value = refreshValue;
					refreshToken.userId = user._id;
					refreshToken.clientId = client._id;
					refreshToken.scope = scope;

					//save refresh token
					refreshToken.save(function(err){
						if(err){
							return done(err);
						}
						return done(null, {token:token, refreshToken:refreshToken, expiresIn: config.token.expiresIn}); 
					});
				}else{ //no refresh token - null
					return done(null, {token:token, refreshToken:refreshToken, expiresIn: config.token.expiresIn});
				}

			});

		});
	});
}));

/**
* Exchange the refresh token for an access token.
*
* The callback accepts the `client`, which is exchanging the client's id from the token
* request for verification. If this value is validated, the application issues an access
* token on behalf of the client who authorized the code
*/
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
	RefreshToken.findOne({value: refreshToken }, function (err, rtoken){
		if(err){
		 return done(err);
		}
		if(!rtoken){
		 return done(null, false);
		}
		if(client._id !== rtoken.clientId){
		 return done(null, false); //bad request
		}

		var value = uid(256);

		var token = new Token();

		token.value = value;
		token.userId = rtoken.userId;
		token.clientId = rtoken.clientId;
		token.scope = rtoken.scope;
		token.expirationDate = config.token.calculateExpirationDate();

		token.save(function(err){
			if(err){
			 return done(err);
			}
			/**no refresh token returned, so every time,
			/use the same refresh token to get a new access token.
			**/
			return done(null, {token:token, refreshToken:refreshToken, expiresIn: config.token.expiresIn}); 
		});

	});
}));

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
];




