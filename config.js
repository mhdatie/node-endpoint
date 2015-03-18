'use strict';

//
// The configuration options of the server
//

/**
* Configuration of access tokens.
*
* expiresIn - The time in seconds before the access token expires
* calculateExpirationDate - A simple function to calculate the absolute
* time that th token is going to expire in.
* authorizationCodeLength - The length of the authorization code
* accessTokenLength - The length of the access token
* refreshTokenLength - The length of the refresh token
*/
exports.token = {
	expiresIn: 3600,
	calculateExpirationDate: function () {
		return new Date(new Date().getTime() + (this.expiresIn * 1000));
	},
	accessTokenLength: 256,
	refreshTokenLength: 256
};
