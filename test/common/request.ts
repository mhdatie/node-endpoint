'use strict';

import * as request from 'supertest';
import { app } from '../../src/server';
const appServer = request.agent(app); //express app

/**
 - For POST-only endpoints
**/
export const postEndpoint = (endpoint, auth, data, next) => {
  appServer.post(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};
/**
 - For GET-only endpoints
**/
export const getEndpoint = (endpoint, auth, data, next) => {
  appServer.get(endpoint)
    .set(auth) //adds header
    .send(data) //sends form data
    .end(next); //handles response
};
