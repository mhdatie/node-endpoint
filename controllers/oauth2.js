/**
	This controller controls the flow of OAuth
**/

// Load required packages
var oauth2orize = require('oauth2orize')
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

//create OAuth 2.0 server
var server = oauth2orize.createServer();

//Register Serialization
server.serializeClient(function(client, callback){
	return callback(null, client._id);
});
//Register Deserialization
server.deserializeClient(function(id, callback){
	Client.findOne({ _id : id }, function(err, client){
		if(err) return callback(err);
		return callback(null, client);
	});
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the auth code and check for errors
  code.save(function(err) {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
  Code.findOne({ value: code }, function (err, authCode) {
    if (err) { return callback(err); }
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove(function (err) {
      if(err) { return callback(err); }

      // Create a new access token
      var token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      });

      // Save the access token and check for errors
      token.save(function (err) {
        if (err) { return callback(err); }

        callback(null, token);
      });
    });
  });
}));

//retruns TRUE if the Authorization code/token is in DB.
//No promt or user permission is needed.
server.authorization(function (clientId, redirectURI, done) {
    Client.findOneById(clientId).done(function(err, client) {
        if (err) { return done(err); }
        return done(null, client, redirectURI);
    });
}, function (client, user, done) {
    Code.find({
        clientId: client._id,
        userId: user._id
    }, function (err, code) {
        if (err) { return done(err); }
        if (code) {
            return done(null, true);
        } else {
            return done(null,false);
        }
    });
});

// User authorization endpoint
//USED TO PROMT A DIALOG
// exports.authorization = [
//   server.authorization(function(clientId, redirectUri, callback) {

//     Client.findOne({ id: clientId }, function (err, client) {
//       if (err) { return callback(err); }

//       return callback(null, client, redirectUri);
//     });
//   }),
//   function(req, res){
//     res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
//   }
// ]

// User decision endpoint
exports.decision = [
  server.decision()
]

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
]

//move to helpers-------------------------------
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//------------------------------------------------


