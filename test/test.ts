'use strict';

import { _val } from './common/validate';
import {Client, User, AccessForm, RefreshForm} from './common/properties';
import * as req from './common/request';
import { User as UserModel } from "../src/models/user";

// const Token = require('../src/models/token');

let accessForm: AccessForm;
let user: User;
let client: Client;
let refreshForm: RefreshForm;

const basicHeader = {'Authorization': 'Basic ' +
                      new Buffer((client) ? (client.id + ':' + client.secret) : '').toString('base64'),
                                'Content-Type':'application/x-www-form-urlencoded'
};

const bearer = {};


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', () => {

  describe('POST /clients', () => {

    it('should create a new client', () => {
      //make sure all fields are in correct form first
      req.postEndpoint('/api/v1/clients',
          {'Content-Type':'application/x-www-form-urlencoded'},
          { name: 'test', id: 'test', secret: 'test'}, (err,res) => {
        _val.success(res);

        const data = res.body.data;

        client = {
          id: data.id,
          secret: data.secret
        };

      });
    });

  });

  describe('POST /users', () => {

    it('should create a new user', () => {
      const payload = {
        username: 'testUser',
        password: 'Passw0r$',
        email: 'test@email.com',
        firstname: 'firstname',
        lastname : 'lastname',
        gender: 'Male',
      };

      req.postEndpoint('/api/v1/users', basicHeader, payload, (err, res) => {
        _val.success(res);
        _val.validateUserObject(res);

        const data = res.body.data;

        user = {
          username: data.username,
          email: data.email,
          password: payload.password,
          firstname: data.info.username,
          lastname: data.info.lastname,
          gender: data.info.gender,
        };
      });
    });

  });
  //
  // describe('POST /oauth/token', () => {
  //
  //   it('should work and return a refresh token', (done) => {
  //     accessForm.scope = 'offline_access';
  //     req.postEndpoint('/api/v1/oauth/token', basicHeader(), accessForm, (err, res) => {
  //       //validate response with chai before calling done
  //       _val.success(res);
  //       _val.validateAccessRefreshToken(res);
  //
  //       //set the GLOBAL refresh token for following tests
  //       refreshToken = res.body.access_token.refreshToken.value;
  //
  //       //exchange refresh token for a new access token
  //       refreshForm.refresh_token = refreshToken;
  //       req.postEndpoint('/api/v1/oauth/token', basic, prop.refreshForm, (err, res) => {
  //         //validate response with chai
  //         _val.success(res);
  //         _val.validateAccessToken(res);
  //         //set the GLOBAL access token for following tests
  //         token = res.body.access_token.token;
  //         done();
  //       });
  //
  //     });
  //   });
  //
  //   it('should work and NOT return a refresh token', (done) => {
  //     prop.accessForm.scope = 'undefined';
  //     req.postEndpoint('/api/v1/oauth/token', basic, prop.refreshForm, (err, res) => {
  //       //validate response with chai before calling done
  //       _val.success(res);
  //       _val.validateAccessToken(res);
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
  //       _val.success(res);
  //       _val.validateUserList(res);
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
  //         _val.success(res);
  //         _val.validateUserObject(res);
  //       });
  //     });
  //
  //     it('should return a specific user limited information', (done) => {
  //       user.username = 'test'; //other user
  //       req.getEndpoint('/api/v1/users/'+ prop.userData.username, bearer, null, (err,res) => {
  //         _val.success(res);
  //         _val.validateUserLimitedObject(res);
  //         done();
  //       });
  //     });
  //
  //   });
  //
  // });

});
