'use strict';

const _v = require('validator');


const validateCreateUser = function(req, callback){
	let firstname = req.body.firstname,
		lastname = req.body.lastname,
		email = req.body.email,
		username = req.body.username,
		password = req.body.password,
		gender = req.body.gender;
	//initialize response constiable
	let err = null;

	if(!_v.isAlpha(firstname)||
		!_v.isAlpha(lastname)||
		!_v.isEmail(email)||
		!_v.matches(gender, /^[M|Fem]ale/)||
		!_v.matches(username, /^[a-zA-Z][a-zA-Z0-9]{4,16}/)|| //must start with a character
		/** uses positive lookahead
			at least one digit, one capital letter, one special
			between 8 and 16 characters
		**/
		!_v.matches(password, /((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,16})/)||
		//user cannot set those fields from application
		req.body.deleted || req.body.admin)
	{ 
		err = 'Validation failed, please check your information.';
	}

	callback(err);

};


exports.validateCreateUser = validateCreateUser;
