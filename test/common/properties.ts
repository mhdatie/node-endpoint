'use strict';

let clientData = {
  id: 'test',
  secret: 'test'
};

let userData = {
  email: 'test@example.com',
  username: 'test-user', //at least 5-16 and first char should be a letter
  password: 'password', //validation fails - should include at least one upper, one digit and one special, between 8-16 chars
  firstname: 'first',
  lastname: 'last',
  gender: 'Male' //either Male or Female
  //rest is optional - won't lead to errors [TEST IT]
};

let accessForm = {
  username: 'matie',
  password : '123',
  grant_type: 'password'
};

let refreshForm = {
  refresh_token: '', 
  grant_type: 'refresh_token'
};

module.exports = {
  clientData,
  userData,
  accessForm,
  refreshForm
};