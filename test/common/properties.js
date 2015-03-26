'use strict';

var props = {};

props.clientData = {
  id: 'test',
  secret: 'test'
};

props.userData = {
  email: 'test@example.com',
  username: 'test-user', //at least 5-16 and first char should be a letter
  password: 'password', //validation fails - should include at least one upper, one digit and one special, between 8-16 chars
  firstname: 'first',
  lastname: 'last',
  gender: 'Male' //either Male or Female
  //rest is optional - won't lead to errors [TEST IT]
};

props.accessForm = {
  username: 'matie',
  password : '123',
  grant_type: 'password'
};

props.refreshForm = {
  refresh_token: '', 
  grant_type: 'refresh_token'
};

module.exports = props;