'use strict';

export interface Client {
  id: string,
  secret: string
}

export interface  User {
  email: string,
  username: string, //at least 5-16 and first char should be a letter
  password: string, //validation fails - should include at least one upper, one digit and one special, between 8-16 chars
  firstname: string,
  lastname: string,
  gender: string //either Male or Female
  //rest is optional - won't lead to errors [TEST IT]
}

export interface AccessForm {
  username: string,
  password : string,
  grant_type: string,
  scope: string
}

export interface Token {
    token: string
}

export interface RefreshForm {
  refresh_token: string,
  grant_type: string
}
