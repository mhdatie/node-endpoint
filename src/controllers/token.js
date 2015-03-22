'use strict';

// Required packages
var Token = require('../models/token'); //used to interact with DB

//not tested
var removeExpired = function(cb){
	Token.find({}, function(err, tokens){
		tokens.forEach(function(token){
			if(new Date() > token.expirationDate){
				//remove token
				Token.findByIdAndRemove({_id: token._id}, function(err){
					if(err){
						return cb(err);
					}
				});
			}
		});
	});
};

module.exports = {
	removeExpired:removeExpired
};