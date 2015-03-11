This current branch follows the Authorization Code strategy, in order to implement a two-legged OAuth, another approach should be considered. Switch to branch: [Resource Owner Password Credentials](https://github.com/MohamadAtieh/node-endpoint/tree/ROPC) to view it. 

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

The project implements Basic Auth for requests. This has the downside of your encoded password being sent over HTTP on each request, when it should be encrypted in some way to avoid sniffing. Periodic tokens are recommended in this case.

Another downside is [@POST /api/v1/users](https://github.com/MohamadAtieh/node-endpoint/blob/master/server.js#L36), which creates users on the server. This endpoint can currently be accessed from any application which could be harmful. Controlling user creation/authorization is possible with OAuth2.

##Potential Problems:

Safely storing the Client ID:SECRET on the client side or mobile app

###This code is open for public reviews, so feel free. Thanks.
