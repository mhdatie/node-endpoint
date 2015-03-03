var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
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
		required: true
	},
	deleted: {
		type: Boolean,
		default: false
	}
});

//todo: hash password before save

module.exports = mongoose.model('User', UserSchema);