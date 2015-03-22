/**
This is the client controller. This can be used in the future by implementing
Authorization codes that enable users to grant third party apps (who are owned by user accounts)
to gain partial access to user data.

For two legged auth (current) strategy, one secret client owned by the main server is 
enough for users authentication to grant them access and refresh tokens.
**/
'use strict';

var Client = require('../models/client.js');

var createClient = function(req,res){
	var response = {};
	var client = new Client();

	//TODO: VALIDATE HELPER like create user

	// Set the client properties that came from the POST data
	client.name = req.body.name;
	client.id = req.body.id;
	client.secret = req.body.secret;
	//client.userId = req.user._id; // api is being accessed by server's client and
									//not 3rd party apps. Default is null for now.

	client.save(function(err){
		if(err){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'Some Error Occured';
			return res.status(400).send(response);
		}

		response.data = client;
		response.error = 'No Error';					
		response.description = 'Client Found';
		return res.status(200).send(response);
	});
};

//get application clients of authenticated user
var getClients = function(req,res){
	var query = {userId : req.user._id}; //provided by passport
	var response = {};
	Client.find(query, function(err, clients){
		if(err){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'No Clients Found';
			return res.status(400).send(response);
		}
		response.data = clients;
		response.error = 'No Error';
		response.description = 'Clients returned successfully';
		return res.status(200).send(response);
	});
};


module.exports = {
	createClient : createClient,
	getClients : getClients
};