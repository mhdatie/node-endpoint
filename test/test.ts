'use strict';

import {
  success, validateUserObject, validateAccessRefreshToken, validateAccessToken,
  validateUserList
} from './common/validate';
import {Client, User, AccessForm, Token, RefreshForm} from './common/properties';
import * as req from './common/request';
import { User as UserModel } from "../src/models/user";
import { Client as ClientModel } from "../src/models/client";


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', () => {

  before('clear user collection', (done) => {
    UserModel.remove({}, (err) => {
      if(err){
        return done(err);
      }
      done();
    });
  });

  before('clear client collection', (done) => {
    ClientModel.remove({}, (err) => {
      if(err){
        return done(err);
      }
      done();
    });

  });

  describe('POST /clients', () => {

    let payload;

    beforeEach('set client payload', () => {
      payload = { name: 'test', id: 'test', secret: 'test'};
    });

    it('should create a new client', (done) => {

      //make sure all fields are in correct form first
      req.postEndpoint('/api/v1/clients',
          {'Content-Type':'application/x-www-form-urlencoded'},
            payload, (err, res) => {

        success(res);

        const client: Client = {
          id: res.body.data.id,
          secret: payload.secret
        };

        const basicHeader = {
          'Authorization': `Basic ${new Buffer(client.id + ':' + client.secret).toString('base64')}`,
          'Content-Type':'application/x-www-form-urlencoded'
        };

        describe('POST /users', () => {

          beforeEach('set user payload', () => {
            payload = {
              username: 'testUser',
              password: 'Passw0r$',
              email: 'test@email.com',
              firstname: 'firstname',
              lastname : 'lastname',
              gender: 'Male',
            };
          });

          it('should create a new user', (done) => {
            req.postEndpoint('/api/v1/users', basicHeader, payload, (err, res) => {

              success(res);
              validateUserObject(res);

              const user: User = {
                id: res.body.data.id,
                username: res.body.data.username,
                email: res.body.data.email,
                password: payload.password,
                firstname: res.body.data.info.username,
                lastname: res.body.data.info.lastname,
                gender: res.body.data.info.gender,
              };

              describe('POST /oauth/token', () => {

                let accessForm: AccessForm;
                beforeEach('set login payload', () => {
                  accessForm = {
                    username: user.username,
                    password: user.password,
                    scope: 'offline_access',
                    grant_type: 'password'
                  };
                });

                it('should work and return a refresh token', (done) => {

                  req.postEndpoint('/api/v1/oauth/token', basicHeader, accessForm, (err, res) => {
                    success(res);
                    validateAccessRefreshToken(res);

                    const refreshForm: RefreshForm = {
                      refresh_token: res.body.access_token.refreshToken.value,
                      grant_type: 'refresh_token'
                    };

                    req.postEndpoint('/api/v1/oauth/token', basicHeader, refreshForm, (err, res) => {
                      success(res);
                      validateAccessToken(res);

                      //bearer token
                      const token: Token = {
                        token: res.body.access_token.token.value
                      };

                      describe('Test users', () => {
                        let bearer;
                        before((done) => {
                          bearer = { 'Authorization': `Bearer ${token.token}` };
                          done();
                        });

                        describe('GET /users', () => {
                          it('should return a list of all users', (done) => {
                            req.getEndpoint('/api/v1/users', bearer, null, (err,res) => {
                              success(res);
                              validateUserList(res);
                              done();
                            });
                          });
                        });

                        describe('GET /users/:username', () => {
                          it('should return a specific user full information', (done) => {
                            //authenticated user
                            req.getEndpoint('/api/v1/users/'+ user.username, bearer, null, (err,res) => {
                              success(res);
                              validateUserObject(res);
                              done();
                            });
                          });
                        });

                        done(); // end POST token
                      });
                    });
                  });

                });

                done(); // end POST user
              });
            });
          });

          done(); // end POST client

        });
      });

    });

  });

});
