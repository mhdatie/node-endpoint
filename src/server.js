'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var https = require('https');
var session = require('express-session');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');
var tokenController = require('./controllers/token');


//passport related
var passport = require('passport');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');

mongoose.connect('mongodb://localhost:27017/infinitlee');

var app = exports.app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize());

//Use express session since OAuth2orize requires it
app.use(session({
	secret: 'Super Secret Session Key', //edit later
	saveUninitialized: true,
	resave: true
}));


app.use(function (err, req, res, next) {
	if (err) {
		res.status(err.status);
		res.json(err);
	} else {
		next();
	}
});

var port = process.env.PORT || 3000;


//Add all routes to the router object and extend them accordingly
var router = express.Router();

//User Routers-----------------------------------
var usersRoute = router.route('/users');
var userRoute = router.route('/users/:username'); //username
//Client Routers---------------------------------
var clientsRoute = router.route('/clients');
//OAuth2 Routers
var accessTokenRoute = router.route('/oauth/token');

//Add all API endpoints here
router.get('/', function(req,res){
	res.json({ message: 'node-endpoint'});
});

//User Endpoints----------------------------------
usersRoute
.post(authController.isAuthenticated, userController.createUser)
.get(authController.isBearerAuthenticated, userController.getUsers);

userRoute
.get(authController.isBearerAuthenticated, userController.getUser)
//.put(authController.isBearerAuthenticated, userController.updateUser)
.delete(authController.isBearerAuthenticated, userController.removeUser);
//Client Endpoints--------------------------------

//Clients are created directly from the mongo cli. These endpoints are useful when
// clients are third party apps requesting access to the user data [another strategy]
clientsRoute
.post(authController.isAuthenticated, clientController.createClient) //not required but implemented
.get(authController.isAuthenticated, clientController.getClients); // not rrequired but implemented

//OAuth 2.0 Endpoints
accessTokenRoute
.post(authController.isAuthenticated, oauth2Controller.token);

//Register routes with /api/v1
app.use('/api/v1', router);

//From time to time we need to clean up any expired tokens
//in the database - every 5 minutes [current]

//not tested
setInterval(function () {
	tokenController.removeExpired(function (err) {
		if (err) {
			console.error('Error removing expired tokens');
		}
	});
}, 25000);

app.listen(port);

console.log('Server listening on port ' + port);

exports.app = app;