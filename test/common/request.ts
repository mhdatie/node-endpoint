'use strict';

const request = require('supertest');
const app = request.agent(require('../../src/server')); //express app

/**
 - For POST-only endpoints
**/
const postEndpoint = (endpoint, auth, data, next) => {
  app.post(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};
/**
 - For GET-only endpoints
**/
const getEndpoint = (endpoint, auth, data, next) => {
  app.get(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};

module.exports = {
    postEndpoint,
    getEndpoint
};
