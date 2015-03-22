'use strict';
// Required packages
var User = require('../models/user'); //used to interact with DB
var userHelpers = require('./helpers/user');

//Create functions for the User endpoint
//TODO: Create CLIENT CREDENTIALS AUTH endpoint. ON SUCCESS: redirect to oauth2/token
var createUser = function(req,res){		
	
	userHelpers.validateCreateUser(req, function(isError){

		var response = {};

		if(isError){
			response.error = 'Bad Request';
			response.description = 'Validation Failed';
			return res.status(400).send(response);
		} 

		var user = new User();

		user.email = req.body.email;
		user.username = req.body.username;
		user.password = req.body.password;
		user.info.firstname = req.body.firstname;
		user.info.lastname = req.body.lastname;
		user.info.gender = req.body.gender;

		user.validate(function(err){
			if(err){
				response.data = null;
				response.error = 'Bad Request';
				response.description = 'Missing Fields';
				return res.status(400).send(response);
			}else{ 
				//TODO: create a function for error handling or use next()
				user.save(function(err, user){
					if(err){
						if(err.hasOwnProperty('code') && err.code === 11000){
							if(err.err.indexOf('username') > -1 || err.err.indexOf('email') > -1){
								response.data = null;
								response.error = 'Bad Request';
								response.description = 'Username or Email already exists';
								return res.status(400).send(response);
							}
						}else{
							response.data = null;
							response.error = 'Bad Request';
							response.description = 'Some Error Occured';
							return res.status(400).send(response);
						}
					}
					//redirect client to /oauth/token with data.user.username, data.user.password, and grant-type
					//= password, scope = offline_access
					// to gain a refresh token.
					response.data = user;
					response.error = 'No error';
					response.description = user.username+' was created successfully';
					return res.status(200).send(response);
					//-- all endpoints from this point on should use the BearerStrategy
				});
			}
		});
	});
};

var getUsers = function(req,res){
	//find all users
	User.find(function(err,users){
		var response = {};
		if(err){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'No Users Found';
			return res.status(400).send(response);	
		} 

		response.data = users;
		response.error = 'No Error';
		response.description = 'Users returned successfully';
		return res.status(200).send(response);
	});
};

var getUser = function(req,res){
	//find by Id
	User.findOne({username: req.params.username}, function(err, user){
		var response = {};
		if(err){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'Some Error Occured';
			return res.status(400).send(response);
		} 
		if(!user){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'User Not Found';
			return res.status(400).send(response);
		}
		if(req.user.username === req.params.username){
			response.data = user;
			response.error = 'No Error';
			response.description = 'User Found';
			return res.status(200).send(response);
		}else{
			//TODO: limited scope to visitor.
			var u = {
				username: user.username //example
			};
			return res.json(u);
		}
	});
};

//REMOVE AND UPDATE should use req.user object to 
//remove and update the authenticated user only.
// var updateUser = function(req,res){
// 	//find by Id, get updated values, save into db
// 	//todo......req.user.username
// };

//use req.user.username
var removeUser = function(req,res){
	//find by Id and remove from db
	User.findByIdAndRemove(req.user._id, function(err){
		var response = {};
		if(err){
			response.data = null;
			response.error = 'Bad Request';
			response.description = 'User Not Found';
			return res.status(400).send(response);
		}
		response.data = null;
		response.error = 'No Error';
		response.description = 'User deleted successfully';
		return res.status(200).send(response);
	});
};

//Export all user functions
module.exports = {
	createUser: createUser,
	getUsers: getUsers,
	getUser: getUser,
	//updateUser: updateUser,
	removeUser: removeUser
};

//alternative:
// exports.createUser = createUser;
// exports.getUsers = getUsers;
// exports.getUser = getUser;
// exports.updateUser = updateUser;
// exports.removeUser = removeUser;