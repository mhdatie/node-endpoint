'use strict';

export const clientData = {
  id: 'test',
  secret: 'test'
};

export const  userData = {
  email: 'test@example.com',
  username: 'test-user', //at least 5-16 and first char should be a letter
  password: 'password', //validation fails - should include at least one upper, one digit and one special, between 8-16 chars
  firstname: 'first',
  lastname: 'last',
  gender: 'Male' //either Male or Female
  //rest is optional - won't lead to errors [TEST IT]
};

export const accessForm = {
  username: 'matie',
  password : '123',
  grant_type: 'password',
  scope: ''
};

export const refreshForm = {
  refresh_token: '', 
  grant_type: 'refresh_token'
};
