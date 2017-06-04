'use strict';
export {}

const config = require('../../config');
// Load required packages
const oauth2orize = require('oauth2orize');
const User = require('../models/user');
const Client = require('../models/client');
const Token = require('../models/token');
const RefreshToken = require('../models/refreshtoken');
/**
	This controller controls the flow of OAuth
**/
//move to helpers-------------------------------

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const uid = len => {
  let buf = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

//create OAuth 2.0 server
const server = oauth2orize.createServer();

//Register Serialization
server.serializeClient((client, callback) => {
	return callback(null, client._id);
});
//Register Deserialization
server.deserializeClient((id, callback) => {
	Client.findOne({ _id : id }, (err, client) => {
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
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {

	User.findOne({username : username}, (err, user) => {
		if(err){
			return done(err);
		} 

		if(!user){
			return done(null, false);
		} 

		user.verifyPassword(password, (err, isMatch) => {
			if(err){
				return done(err);
			} 

			if(!isMatch){
				return done(null, false);
			} 
			
			let value = uid(config.token.accessTokenLength);

			let token = new Token();

			token.value = value;
			token.userId = user._id;
			token.clientId = client._id;
			token.expirationDate = config.token.calculateExpirationDate();
			if(scope && scope.indexOf('offline_access') !== -1){
				token.scope = scope;
			}
			
			token.save(err => {
				if (err) {
					return done(err);
				}

				let refreshToken = null;

				if(scope && scope.indexOf('offline_access') !== -1){
					let refreshValue = uid(config.token.refreshTokenLength);
					refreshToken = new RefreshToken();
				
					refreshToken.value = refreshValue;
					refreshToken.userId = user._id;
					refreshToken.clientId = client._id;
					refreshToken.scope = scope;

					//save refresh token
					refreshToken.save( err => {
						if(err){
							return done(err);
						}
						return done(null, {token:token, refreshToken: refreshToken, expiresIn: config.token.expiresIn});
					});
				}else{ //no refresh token - null
					return done(null, {token: token, refreshToken: refreshToken, expiresIn: config.token.expiresIn});
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
server.exchange(oauth2orize.exchange.refreshToken( (client, refreshToken, done) => {
	RefreshToken.findOne({value: refreshToken },  (err, rtoken) => {
		if(err){
		 return done(err);
		}

		if(!rtoken){
		 return done(null, false);
		}

		if(String(client._id) !== String(rtoken.clientId)){
		 return done(null, false); //bad request
		}

		let value = uid(256);

		let token = new Token();

		token.value = value;
		token.userId = rtoken.userId;
		token.clientId = rtoken.clientId;
		token.scope = rtoken.scope;
		token.expirationDate = config.token.calculateExpirationDate();

		token.save(err => {
			if(err){
			 return done(err);
			}
			/**no refresh token returned, so every time,
			/ use the same refresh token to get a new access token.
			**/
			return done(null, {token:token, refreshToken: null, expiresIn: config.token.expiresIn}); 
		});

	});
}));

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
];




