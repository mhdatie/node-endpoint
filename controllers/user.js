// Required packages
var User = require('../models/user'); //used to interact with DB

//Create functions for the User endpoint

var createUser = function(req,res){
	var user = new User(req.body);
	user.validate(function(err){
		if(err){
			return res.status(400).send('Bad Request');
		}else{
			//create a function for error handling or use next()
			user.save(function(err, user){
				if(err){
					if(err.hasOwnProperty('code') && err.code === 11000){
						if(err.err.indexOf("username") > -1 || err.err.indexOf("email") > -1)
							//status(404)
							return res.json({error: 'Username or Email already exists.'});
					}else{
						return res.status(400).send({error: 'Bad Request'});
					}
				}
				return res.json({message: 'New user created.'});
			});
		}
	});
	
};

var getUsers = function(req,res){
	//find all users
	User.find(function(err,users){
		if(err) return res.send(err);

		return res.json(users);
	});
};

var getUser = function(req,res){
	//find by Id
	User.findOne({username: req.user.username}, function(err, user){
		if(err) return res.send(err);

		return res.json(user);
	});
};

//REMOVE AND UPDATE should use req.user object to 
//remove and update the authenticated user only.
var updateUser = function(req,res){
	//find by Id, get updated values, save into db
	//todo......req.user.username
};

//use req.user.username
var removeUser = function(req,res){
	//find by Id and remove from db
	User.findByIdAndRemove(req.params.id, function(err){
		if(err) return res.send(err);

		return res.json({message: 'User deleted.'});
	});
};

//Export all user functions
module.exports = {
	createUser: createUser,
	getUsers: getUsers,
	getUser: getUser,
	updateUser: updateUser,
	removeUser: removeUser
}

//alternative:
// exports.createUser = createUser;
// exports.getUsers = getUsers;
// exports.getUser = getUser;
// exports.updateUser = updateUser;
// exports.removeUser = removeUser;
