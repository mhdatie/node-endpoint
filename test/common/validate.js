'use strict';

var expect = require('chai').expect;

var validate = {};

validate.validateAccessToken = function(res){
	expect(res.status).to.equal(200);
	expect(res.header).to.have.property('content-type').that.is.equal('application/json');
	expect(Object.keys(res.body).length).to.equal(2);
	expect(Object.keys(res.body['access_token']).length).to.equal(3);
	expect(res.body.access_token.token.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken).to.be.a('null');		
	expect(res.body.access_token.expiresIn).to.equal(3600);
	expect(res.body.token_type).to.equal('Bearer');
};

validate.validateAccessRefreshToken = function(res){
	expect(res.status).to.equal(200);
	expect(res.header).to.have.property('content-type').that.is.equal('application/json');
	expect(Object.keys(res.body).length).to.equal(2);
	expect(Object.keys(res.body['access_token']).length).to.equal(3);
	expect(res.body.access_token.token.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken.scope).to.equal(res.body.access_token.token.scope);		
	expect(res.body.access_token.expiresIn).to.equal(3600);
	expect(res.body.token_type).to.equal('Bearer');
};

validate.validateUserObject = function(res){

};

validate.validateUserLimitedObject = function(res){

};

validate.validateUserList = function(res){

};

module.exports = validate;