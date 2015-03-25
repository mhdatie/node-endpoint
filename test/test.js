'use strict';

var request = require('supertest');
var should = require('chai').should();
var winston = require('winston'); //for logs
var mongoose = require('mongoose');

var app = request.agent(require('../src/server')); //express app

var token = ''; //global
var refreshToken = ''; //global

var clientData = {
  id: 'test',
  secret: 'test'
};

var userData = {
  email: 'test@test.com',
  username: 'test-user', //at least 5-16 and first char should be a letter
  password: 'password', //validation fails - should include at least one upper, one digit and one special, between 8-16 chars
  firstname: 'first',
  lastname: 'last',
  gender: 'Male' //either Male or Female
  //rest are optional - won't lead to errors [TEST IT]
};

var basic = {'Authorization': 'Basic ' + new Buffer(clientData.id + ':' + clientData.secret).toString('base64'),
            'Content-Type': 'application/json'
};
var bearer = {'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
};

var accessForm = {
  username: 'matie',
  password : '123',
  grant_type: 'password'
};

var refreshForm = {
  refreshToken: refreshToken,
  grant_type: 'refresh_token'
};

/**
 - For POST-only endpoints
**/
var postEndpoint = function(endpoint, auth, data, next){
  app.post(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
}
/**
 - For GET-only endpoints
**/
var getEndpoint = function(endpoint, auth, data, next){
  app.get(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
}

//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', function(){
  this.timeout(20000); //20 seconds timeout
  
  //make sure if mongodb running
  before('Creating DB Connection', function(done) {
    mongoose.createConnection('mongodb url');
    done();
  });
  
  after('Terminating DB Connection', function(done){
    //close connection
    mongoose.disconnect();
    done();
  });

  describe('POST /oauth/token', function(){
      
    it('should work and return a refresh token', function(done){
      accessForm.scope = 'offline_access';
      postEndpoint('/oauth/token', basic, accessForm, function(err, res){
      //validate response with chai before calling done
          
          
        //exchange refresh token for a new access token
        postEndpoint('/oauth/token', basic, refreshForm, function(err, res){
          //validate response with chai
          done();  
        });
        
      });
    });
    
    it('should work and NOT return a refresh token', function(done){
      accessForm.scope = 'undefined';
      postEndpoint('/oauth/token', basic, refreshForm, function(err, res){
        //validate response with chai before calling done
        done();
      });
    });
      
  });
  
  describe('POST /users', function(){
    /**
      - Authenticate client
      - Return a new user upon creation
    **/
    it('should create a new user');
  });
  
  describe('GET /users', function(){
    /**
      - Authenticate the Bearer "Access" Token
      - Return a list of all users
    **/
    it('should return a list of all users');
  });
  
  describe('GET /users/:username', function(){
    /**
      - Authenticate the Bearer "Access" Token
      - Return one user
    **/
    it('should return a specific user');
  });
  
  describe('Token Expiration Case', function(){
    /**
      - Attempt to get a user
      - The user's token has expired, use refresh token to get a new one
      - Get the user again
    **/
    it('should return false indicating an expired token and return a new one');
  });

});
