var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ClientSchema = new mongoose.Schema({
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

ClientSchema.pre('save', function(callback){
	var client = this;

	if(!client.isModified('secret')) return callback();

	bcrypt.genSalt(5, function(err, salt){
		if(err) return callback(err);

		bcrypt.hash(client.secret, salt, null, function(err, hash){
			if(err) return callback(err);
			client.secret = hash;
			callback();
		});
	});
});

ClientSchema.methods.verifySecret = function(secret, cb){
	bcrypt.compare(secret, this.secret, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Client', ClientSchema);