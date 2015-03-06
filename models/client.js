var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
	name:{
		type: String,
		unique: true,
		required: true
	},
	id:{
		type: String,
		required: true	
	},
	secret:{
		type: String,
		required: true	
	},
	userId:{
		type: String,
		required: true	
	},
	type:{
		type: String,
		required: true,
		default: 'user' //or admin	
	}
});

module.exports = mongoose.model('Client', ClientSchema);