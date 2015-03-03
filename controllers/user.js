// Required packages
var User = require('../models/user'); //used to interact with DB

//Create functions for the User endpoint

var createUser = function(req,res){
	var user = new User();

	user.username = req.body.username;
	user.password = req.body.password;

	//todo: set salt
	//todo: removed field defaulted to FALSE

	//save new user
}

var getUsers = function(req,res){
	//find all users
}

var getUser = function(req,res){
	//find by Id
}

var updateUser = function(req,res){
	//find by Id, get updated values, save into db
}

var removeUser = function(req,res){
	//find by Id and remove from db
}

//Export all user functions
module.exports = {
	createUser: createUser;
	getUsers: getUsers;
	getUser: getUser;
	updateUser: updateUser;
	removeUser: removeUser;
}

//alternative:
// exports.createUser = createUser;
// exports.getUsers = getUsers;
// exports.getUser = getUser;
// exports.updateUser = updateUser;
// exports.removeUser = removeUser;