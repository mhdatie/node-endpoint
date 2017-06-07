'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		default: null
	},
	info: {
		firstname:{
			type: String,
			required: true
		},
		lastname:{
			type: String,
			required: true
		},
		gender:{
			type: String,
			required: true
		},
		dob:{
			type: Date,
			default: null //optional
		},
		bio: {
			type: String,
			default: null //optional
		},
		createdAt: {
			type: Date,
			default: new Date()
		}
	},
	deleted: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	}
});

//hash password before save
UserSchema.pre('save', function(callback){
	let user = this;

	if(!user.isModified('password')){
		return callback();
	}

	bcrypt.genSalt(5, (err, salt) => {

		if(err){
			return callback(err);	
		} 

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if(err){
				return callback(err);
			} 
			user.password = hash;
			user.salt = salt;
			callback();
		});

	});
});

UserSchema.methods.verifyPassword = function(password, cb){
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if(err){
			return cb(err);
		} 
		cb(null, isMatch);
	});
};

export const User = mongoose.model('User', UserSchema);