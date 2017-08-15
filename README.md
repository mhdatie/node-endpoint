
The current branch implements the [ROPC](http://tools.ietf.org/html/rfc6749#section-4.3) strategy. 
**[View Architecture](https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/Security-Scenarios#resource-owner-password-credentials)**

This is a good starting point for any one trying to implement a stand-alone API for different device types (mobile, tablet, PC, etc). 

Make sure to understand the architecture and read through the advantages of this approach if you were willing to add more security such as detecting the device accessing the API through tokens and more!

This approach can prevent two users accessing the API on different devices at the same time and notify the user by sending an email for instance. **This project does not cover all these features but can be easily extended**.

# node-endpoint
A Node.js RESTful API using Express, Mongoose, Passport & Gulp. Tests are in Mocha + Supertest + Chai, and Winston for logs.

Basic use case:

- User Authorization/Registration.

## Database:

- MongoDB, with Mongoose API

For testing, it is recommended not to mess around with the main database, instead, create a **replica set** for that purpose. In other words, a mirror DB containing the same data as the production DB.

[Read More](http://stackoverflow.com/a/11571916/2898754)	

## Authentication

- [Passport](http://passportjs.org/) module.
- **Strategy**:
  - [Two-Legged OAuth2](http://stackoverflow.com/a/7562407/2898754). This basically skips the stage where a request token is exchanged for an access token assuming the client (mobile app) is a safe end and can communicate with the user (server/this). For this purpose, the client has to have a pre-defined client key:secret for authentication, along with the username and password. If all information is valid, the access token is granted and is used for any further requests.
  - Typically, a refresh token has to be assigned accordingly once the issued one has expired. 

This project will provide a full implementation of the server application with documentation. 

## Current Implementation:

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

## Todo:

- Configure Webpack to be able to run `npm start`
- Add HTTPS

## Installation

`npm install`

## Run the app

`npm run dev`

## License

MIT

### This code is open for public reviews, so feel free. Thanks.
