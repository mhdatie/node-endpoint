///<reference path="../node_modules/@types/node/index.d.ts" />

'use strict';
import {removeUser, getUser, getUsers, createUser} from "./controllers/user";
import {isBearerAuthenticated, isAuthenticated} from "./controllers/auth";
import {createClient, getClients} from "./controllers/client";
import {removeExpired} from "./controllers/token";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

//passport related
const passport = require('passport');
const oauth2Controller = require('./controllers/oauth2');

mongoose.connect('mongodb://localhost:27017/test-server');

const appServer = express();

appServer.use(bodyParser.urlencoded({
	extended: true
}));

appServer.use(passport.initialize());

//Use express session since OAuth2orize requires it
appServer.use(session({
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
.post(isAuthenticated, createUser)
.get(isBearerAuthenticated, getUsers);

userRoute
.get(isBearerAuthenticated, getUser)
.delete(isBearerAuthenticated, removeUser);

clientsRoute
.post(createClient) // required for tests
.get(isAuthenticated, getClients); // not required but implemented

accessTokenRoute
.post(isAuthenticated, oauth2Controller.token);

appServer.use('/api/v1', router);

//Clean up any expired tokens
//in the database - every 5 minutes [current]
//not tested
setInterval(()=> {
	removeExpired(err => {
		if (err) {
			console.error('Error removing expired tokens');
		}
	});
}, 25000);

appServer.listen(port);

console.log('Server listening on port ' + port);

export const app = appServer;