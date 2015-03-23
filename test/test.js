'use strict';

var request = require('supertest');
var should = require('chai').should();
var assert = require('chai').assert;
var expect = require('chai').expect;
var winston = require('winston'); //for logs
var mongoose = require('mongoose');

var app = request.agent(require('../src/server')); //express app

var token = '';
var refreshToken = '';

var clientData = {
  id: 'test',
  secret: 'test'
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

var oauthExchange = function(data, next){
  app.post('/oauth/token')
    .set(basic) //adds header
    .send(data) //sends form data
    .end(next); //handles response
}

//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Authentication', function(){
  before(function(done) {
    mongoose.connect('mongodb url');
    done();
  });
  
  //testing password endpoint
  describe('Grant type: Password', function(){
    this.timeout(20000); //20 seconds timeout
    
    it('should work and return a refresh token', function(done){
      accessForm.scope = 'offline_access';
      oauthExchange(accessForm, function(err, res){
        //validate response with chai before calling done
      });
    });
    
    it('should work and NOT return a refresh token', function(done){
      accessForm.scope = 'undefined';
      oauthExchange(accessForm, function(err, res){
        //validate response with chai before calling done
      });
    });
    
  });
});
