'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const https = require('https');
const session = require('express-session');
const userController = require('./controllers/user');
const clientController = require('./controllers/client');
const tokenController = require('./controllers/token');

//passport related
const passport = require('passport');
const authController = require('./controllers/auth');
const oauth2Controller = require('./controllers/oauth2');

mongoose.connect('mongodb://localhost:27017/test-server');

const app = express();
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

const port = process.env.PORT || 3000;


const router = express.Router();

const usersRoute = router.route('/users');
const userRoute = router.route('/users/:username');

const clientsRoute = router.route('/clients');
const accessTokenRoute = router.route('/oauth/token');

router.get('/', (req, res) => {
	res.json({ message: 'node-endpoint'});
});

usersRoute
.post(authController.isAuthenticated, userController.createUser)
.get(authController.isBearerAuthenticated, userController.getUsers);

userRoute
.get(authController.isBearerAuthenticated, userController.getUser)
.delete(authController.isBearerAuthenticated, userController.removeUser);

clientsRoute
.post(authController.isAuthenticated, clientController.createClient) //not required but implemented
.get(authController.isAuthenticated, clientController.getClients); // not rrequired but implemented

accessTokenRoute
.post(authController.isAuthenticated, oauth2Controller.token);

app.use('/api/v1', router);

//Clean up any expired tokens
//in the database - every 5 minutes [current]
//not tested
setInterval(()=> {
	tokenController.removeExpired(err => {
		if (err) {
			console.error('Error removing expired tokens');
		}
	});
}, 25000);

app.listen(port);

console.log('Server listening on port ' + port);

module.exports = app;