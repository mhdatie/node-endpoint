
The current branch implements the [ROPC](http://tools.ietf.org/html/rfc6749#section-4.3) strategy. 

# node-endpoint
A Node.js RESTful API using Express, Mongoose, Passport & Gulp. Tests are in Mocha + Supertest + Chai, and Winston for logs.

Basic use case(s):

- User Login/Registration

Future implementations will be pushed on a seperate branch to provide different approaches.

##Database:

- MongoDB, with Mongoose API

##Authentication:

- [Passport](http://passportjs.org/) module.
- **Strategy**:
  - [Two-Legged OAuth2](http://stackoverflow.com/a/7562407/2898754). This basically skips the stage where a request token is exchanged for an access token assuming the client (mobile app) is a safe end and can communicate with the user (server/this). For this purpose, the client has to have a pre-defined client key:secret for authentication, along with the username and password. If all information is valid, the access token is granted and is used for any further requests.
  - Typically, a refresh token has to be assigned accordingly once the issued one has expired. 

This project will provide a full implementation of the server application with documentation. 

##Current Implementation:

The project implements Resource Owner Password Credentials for requests. This method HAS to be implemented in HTTPS (so far in HTTP). 

- First, using Basic Strategy, enter Client ID and Password to autheniticate Client.
- Second, visit the token enpoint **(/api/v1/oauth/token)**, with the following x-www-form-uelencoded fields:
  - grant_type: password
  - username: user's username
  - password: user's password
  - scope: offline_access (optional - to grant refresh tokens)
- Last, all endpoints should be surrounded with the **Bearer strategy** which will fetch the current active token of the authenticated user and access the data.

In case the access token was expired, redirect the user from the client side to **(/api/v1/oauth/token)**, after basic client authentication, with the following x-www-form-uelencoded fields:
  - grant_type: refresh_token
  - refreshToken: 'actual_refresh_token'

The scope would be the same as before, **offline_access**, in order to use the refresh token as many as the user wants to gain new access tokens. [Reference](http://stackoverflow.com/questions/8953983/do-google-refresh-token-expire)

##Todo:

- [Validate](test/common/validate.js#L30) the successful tests.
- Test remaining [pending tests](test/test.js#L122).
- Create a unified error format.
	- Test for error cases.
- Add Karma.
- Update [Gulp File](gulpfile.js).
- Add limited scope to sensitive data.
- Improve server.js file - add any missing configurations/routes/clean-up/etc.
- Add HTTPS.

##License

MIT

###This code is open for public reviews, so feel free. Thanks.
