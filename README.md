The current branch implements [ROPC](http://tools.ietf.org/html/rfc6749#section-4.3). 

# node-endpoint
A Node.js RESTful API for user creation, authentication and settings.

This API will be serving a future Android App for basic use cases:

- User Login/Registration
- User Settings - for syncing purposes

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
- Second, visit the token enpoint **(/api/v1/oauth2/token)**, with the following x-www-form-uelencoded fields:
  - grant_type: password
  - username: user's username
  - password: user's password
  - scope: offline_access (todo)
- Last, all endpoints should be surrounded with the Bearer strategy which will fetch the current active token of the authenticated user and access the data.

##Todo:

- Implement refresh tokens with expiry dates.
- Validate fields and handle errors.
- Add HTTPS.

##Potential Problems:

Safely storing the Client ID:SECRET on the client side or mobile app

###This code is open for public reviews, so feel free. Thanks.
