'use strict';

var request = require('supertest');

var app = request.agent(require('../../src/server')); //express app

var requests = {};
/**
 - For POST-only endpoints
**/
requests.postEndpoint = function(endpoint, auth, data, next){
  app.post(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};
/**
 - For GET-only endpoints
**/
requests.getEndpoint = function(endpoint, auth, data, next){
  app.get(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};

module.exports = requests;
