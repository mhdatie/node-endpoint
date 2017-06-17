'use strict';

import * as chai from 'chai';
const expect = chai.expect;

export const success = (res) => {
	expect(res.status).to.equal(200);
	expect(res.type).to.equal('application/json');
};

export const validateAccessToken = (res) => {
	expect(Object.keys(res.body).length).to.equal(2);
	expect(Object.keys(res.body.access_token).length).to.equal(3);
	expect(res.body.access_token.token.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken).to.be.a('null');		
	expect(res.body.access_token.expiresIn).to.equal(3600);
	expect(res.body.token_type).to.equal('Bearer');
};

export const validateAccessRefreshToken = (res) => {
	expect(Object.keys(res.body).length).to.equal(2);
	expect(Object.keys(res.body.access_token).length).to.equal(3);
	expect(res.body.access_token.token.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken.value.length).to.equal(256);
	expect(res.body.access_token.refreshToken.scope).to.equal(res.body.access_token.token.scope);		
	expect(res.body.access_token.expiresIn).to.equal(3600);
	expect(res.body.token_type).to.equal('Bearer');
};

export const validateUserObject = (res) => {
	expect(Object.keys(res.body).length).to.equal(3);
	expect(Object.keys(res.body.data).length).to.equal(8);
	expect(res.body.data).to.have.property('username').that.match(/^[a-zA-Z][a-zA-Z0-9]{4,16}/);
	expect(res.body.data).to.have.property('password').that.match(/((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,16})/);
	expect(res.body.data).to.have.property('email').that.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
	expect(Object.keys(res.body.data.info).length).to.equal(6);
	expect(res.body.data.info).to.have.property('firstname').that.match(/^[a-z]+$/i);
	expect(res.body.data.info).to.have.property('lastname').that.match(/^[a-z]+$/i);
	expect(res.body.data.info).to.have.property('gender').that.match(/^[M|Fem]ale/);
	expect(res.body.data.deleted).to.be.false;
	expect(res.body.data.admin).to.be.false;
};

export const validateUserLimitedObject = (res) => {
	expect(Object.keys(res.body).length).to.equal(1);
	expect(res.body.username).to.have.property('username').that.match(/^[a-zA-Z][a-zA-Z0-9]{4,16}/);
};

export const validateUserList = (res) => {
	expect(Object.keys(res.body).length).to.equal(3); //data array
	expect(res.body).to.have.property('data').that.is.an('array'); //has to be an array
	
	// call validateUserObject or do something similar?	
};