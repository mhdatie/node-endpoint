'use strict';

import {success, validateUserObject} from './common/validate';
import {Client, User, AccessForm, RefreshForm, Token} from './common/properties';
import * as req from './common/request';
import { User as UserModel } from "../src/models/user";

// const Token = require('../src/models/token');

const bearer = {};


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', () => {

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
          'Authorization': 'Basic '
          + new Buffer(
                              (client)
                              ? (client.id + ':' + client.secret)
                              : '').toString('base64'),
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
                username: res.body.data.username,
                email: res.body.data.email,
                password: payload.password,
                firstname: res.body.data.info.username,
                lastname: res.body.data.info.lastname,
                gender: res.body.data.info.gender,
              };

              done(); // end POST user
            });
          });

        });

        done(); // end POST client

      });
    });

  });



  // describe('POST /oauth/token', () => {
  //
  //     it('should work and return a refresh token', () => {
  //         console.log({n: 3, user: user});
  //         accessForm = {
  //             username: user.username,
  //             password: user.password,
  //             scope: 'offline_access',
  //             grant_type: 'password'
  //         };
  //
  //         req.postEndpoint('/api/v1/oauth/token', basicHeader, accessForm, (err, res) => {
  //             success(res);
  //             validateAccessRefreshToken(res);
  //
  //             //set the GLOBAL refresh token for following tests
  //             refreshForm = {
  //                 refresh_token: res.body.access_token.refreshToken.value,
  //                 grant_type: 'refresh_token'
  //             };
  //
  //             //exchange refresh token for a new access token
  //             req.postEndpoint('/api/v1/oauth/token', basicHeader, refreshForm, (err, res) => {
  //                 success(res);
  //                 validateAccessToken(res);
  //                 //bearer token
  //                 token = {
  //                     token: res.body.access_token.token
  //                 }
  //             });
  //         });
  //     });
  // });





  //
  //   it('should work and NOT return a refresh token', (done) => {
  //     prop.accessForm.scope = 'undefined';
  //     req.postEndpoint('/api/v1/oauth/token', basic, prop.refreshForm, (err, res) => {
  //       //validate response with chai before calling done
  //       success(res);
  //       validateAccessToken(res);
  //       done();
  //     });
  //   });
  //
  // });
  //
  // describe('GET /users', () => {
  //
  //   before((done) => {
  //     bearer['Authorization'] = 'Bearer ' + (token) ? token.value : '';
  //     done();
  //   });
  //
  //   after((done) => {
  //     //remove created user
  //     UserModel.findByIdAndRemove((user) ? user._id : '', (err) => {
  //       if(err){
  //         return done(err);
  //       }
  //       done();
  //     });
  //
  //   });
  //
  //   /**
  //     - Authenticate the Bearer "Access" Token
  //     - Return a list of all users
  //   **/
  //   it('should return a list of all users', (done) => {
  //     //no data sent
  //     req.getEndpoint('/api/v1/users', bearer, null, (err,res) => {
  //       success(res);
  //       validateUserList(res);
  //       done();
  //     });
  //   });
  //
  //
  //   describe('GET /users/:username', () => {
  //     /**
  //       - Authenticate the Bearer "Access" Token
  //       - Return one user specified in params list - no data sent
  //     **/
  //     it('should return a specific user full information', () => {
  //       //authenticated user
  //       req.getEndpoint('/api/v1/users/'+ prop.userData.username, bearer, null, (err,res) => {
  //         success(res);
  //         validateUserObject(res);
  //       });
  //     });
  //
  //     it('should return a specific user limited information', (done) => {
  //       user.username = 'test'; //other user
  //       req.getEndpoint('/api/v1/users/'+ prop.userData.username, bearer, null, (err,res) => {
  //         success(res);
  //         validateUserLimitedObject(res);
  //         done();
  //       });
  //     });
  //
  //   });
  //
  // });

});
