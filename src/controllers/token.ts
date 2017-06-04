'use strict';
export {}

// Required packages
const Token = require('../models/token'); //used to interact with DB

//not tested
const removeExpired = cb => {
	Token.find({}, (err, tokens) => {
		tokens.forEach(token => {
			if(new Date() > token.expirationDate){
				//remove token
				Token.findByIdAndRemove({_id: token._id}, err => {
					if(err){
						return cb(err);
					}
				});
			}
		});
	});
};

module.exports = {
	removeExpired
};