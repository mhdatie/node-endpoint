'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const ClientSchema = new mongoose.Schema({
	name:{
		type: String,
		unique: true,
		required: true
	},
	id:{
		type: String,
		unique: true,
		required: true	
	},
	secret:{
		type: String,
		required: true	
	},
	userId:{
		type: String,
		default: null //null for now
	},
	type:{
		type: String,
		required: true,
		default: 'admin' //or admin	
	}
});

ClientSchema.pre('save', function(callback) {
	let client = this;

	if(!client.isModified('secret')){
		return callback();
	}

	bcrypt.genSalt(5, (err, salt) => {
		if(err){
			return callback(err);
		} 

		bcrypt.hash(client.secret, salt, null, (err, hash) => {
			if(err){
				return callback(err);
			} 
			client.secret = hash;
			callback();
		});
	});
});

ClientSchema.methods.verifySecret = function(secret, cb){
	bcrypt.compare(secret, this.secret, (err, isMatch) => {
		if(err){
			return cb(err);	
		} 
		cb(null, isMatch);
	});
};

export const Client = mongoose.model('Client', ClientSchema);