'use strict';

import { _val } from './common/validate';
import * as prop from './common/properties';
import * as req from './common/request';
import { User } from "../src/models/user";

// const Token = require('../src/models/token');

let token = null;
let user = null;
let refreshToken: string = ''; //global

const basic = {'Authorization': 'Basic ' +
              new Buffer(prop.clientData.id+':'+ prop.clientData.secret).toString('base64'),
              'Content-Type':'application/x-www-form-urlencoded'};

const bearer = {};


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', () => {
  // timeout(20000); //20 seconds timeout

  describe('POST /oauth/token', () => {
      
    it('should work and return a refresh token', (done) => {
      prop.accessForm.scope = 'offline_access';
      req.postEndpoint('/api/v1/oauth/token', basic, prop.accessForm, (err, res) => {
        //validate response with chai before calling done
        _val.success(res);
        _val.validateAccessRefreshToken(res);
        
        //set the GLOBAL refresh token for following tests
        refreshToken = res.body.access_token.refreshToken.value;

        //exchange refresh token for a new access token
        prop.refreshForm.refresh_token = refreshToken;
        req.postEndpoint('/api/v1/oauth/token', basic, prop.refreshForm, (err, res) => {
          //validate response with chai
          _val.success(res);
          _val.validateAccessToken(res);
          //set the GLOBAL access token for following tests
          token = res.body.access_token.token;
          done();  
        });
        
      });
    });
    
    it('should work and NOT return a refresh token', (done) => {
      prop.accessForm.scope = 'undefined';
      req.postEndpoint('/api/v1/oauth/token', basic, prop.refreshForm, (err, res) => {
        //validate response with chai before calling done
        _val.success(res);
        _val.validateAccessToken(res);
        done();
      });
    });
      
  });
  
  describe('POST /users', () => {
    /**
      - Authenticate client
      - Return a new user upon creation
    **/    
    it('should create a new user', (done) => {
      //make sure all fields are in correct form first
      prop.userData.username = 'testUser';
      prop.userData.password = 'Passw0r$';
      req.postEndpoint('/api/v1/users', basic, prop.userData, (err,res) => {
        _val.success(res);
        _val.validateUserObject(res);
        user = res.body.data;
        done();
      });
    });

  });
  
  describe('GET /users', () => {
    
    before((done) => {
      bearer['Authorization'] = 'Bearer ' + (token) ? token.value : '';
      done();
    });

    after((done) => {
      //remove created user
      User.findByIdAndRemove((user) ? user._id : '', (err) => {
        if(err){
          return done(err);
        }
        done();
      });

    });

    /**
      - Authenticate the Bearer "Access" Token
      - Return a list of all users
    **/
    it('should return a list of all users', (done) => {
      //no data sent
      req.getEndpoint('/api/v1/users', bearer, null, (err,res) => {
        _val.success(res);
        _val.validateUserList(res);
        done();
      });
    });
  
  
    describe('GET /users/:username', () => {
      /**
        - Authenticate the Bearer "Access" Token
        - Return one user specified in params list - no data sent
      **/
      it('should return a specific user full information', () => {
        //authenticated user
        req.getEndpoint('/api/v1/users/'+ prop.userData.username, bearer, null, (err,res) => {
          _val.success(res);
          _val.validateUserObject(res);
        }); 
      });

      it('should return a specific user limited information', (done) => {
        prop.userData.username = 'test'; //other user
        req.getEndpoint('/api/v1/users/'+ prop.userData.username, bearer, null, (err,res) => {
          _val.success(res);
          _val.validateUserLimitedObject(res);
          done();
        }); 
      });

    });

  });

});
