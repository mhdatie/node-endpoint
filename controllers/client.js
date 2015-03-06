var Client = require('../models/client.js');

var createClient = function(req,res){

	var client = new Client();

	// Set the client properties that came from the POST data
	client.name = req.body.name;
	client.id = req.body.id;
	client.secret = req.body.secret;
	client.userId = req.user._id; //authenticated only

	client.save(function(err){
		if(err) return res.send(err);

		return res.json({message: 'New Client Created', data: client});
	});
};

//get application clients of authenticated user
var getClients = function(req,res){
	var query = {userId : req.user._id}; //provided by passport
	Client.find(query, function(err, clients){
		if(err) return res.send(err);

		return res.json(clients);
	});
};


module.exports = {
	createClient : createClient,
	getClients : getClients
};