var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var https = require('https');
var session = require('express-session');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');


//passport related
var passport = require('passport');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');

mongoose.connect('mongodb://localhost:27017/infinitlee');

var app = express();
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
var clientAccessTokenRoute = router.route('/oauth/c/token');


//Add all API endpoints here
router.get('/', function(req,res){
	res.json({ message: "node-endpoint"});
});

//User Endpoints----------------------------------
usersRoute
.post(authController.isBearerAuthenticated, userController.createUser) //todo
.get(authController.isBearerAuthenticated, userController.getUsers);

userRoute
.get(authController.isBearerAuthenticated, userController.getUser)
.put(authController.isBearerAuthenticated, userController.updateUser) //todo
.delete(authController.isBearerAuthenticated, userController.removeUser);
//Client Endpoints--------------------------------
clientsRoute
.post(authController.isBearerAuthenticated, clientController.createClient) //todo
.get(authController.isBearerAuthenticated, clientController.getClients);
//OAuth 2.0 Endpoints
accessTokenRoute
.post(authController.isAuthenticated, oauth2Controller.token); //password grant
clientAccessTokenRoute
.post(authController.isClientAuthenticated, oauth2Controller.token); //client credentials grant


//Register routes with /api/v1
app.use('/api/v1', router);

app.listen(port);

console.log('Server listening on port ' + port);