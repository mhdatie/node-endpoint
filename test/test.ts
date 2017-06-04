'use strict';

const req = require('./common/properties');
const prop = require('./common/request');
const val = require('./common/validate');

const clientData = prop.clientData;
const accessForm = prop.accessForm;
const refreshForm = prop.refreshForm;
const userData = prop.userData;

// const Token = require('../src/models/token');
const User = require('../src/models/user');

let token = {}; //global
let refreshToken = {}; //global
let user = {};

const basic = {'Authorization': 'Basic ' +
              new Buffer(clientData.id+':'+ clientData.secret).toString('base64'),
              'Content-Type':'application/x-www-form-urlencoded'};

const bearer = {};


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', function(){
  this.timeout(20000); //20 seconds timeout

  describe('POST /oauth/token', function(){
      
    it('should work and return a refresh token', function(done){
      accessForm.scope = 'offline_access';
      req.postEndpoint('/api/v1/oauth/token', basic, accessForm, function(err, res){
        //validate response with chai before calling done
        val.success(res);
        val.validateAccessRefreshToken(res);
        
        //set the GLOBAL refresh token for following tests
        refreshToken = res.body.access_token.refreshToken.value;

        //exchange refresh token for a new access token
        refreshForm.refresh_token = refreshToken;
        req.postEndpoint('/api/v1/oauth/token', basic, refreshForm, function(err, res){
          //validate response with chai
          val.success(res);
          val.validateAccessToken(res);
          //set the GLOBAL access token for following tests
          token = res.body.access_token.token;
          done();  
        });
        
      });
    });
    
    it('should work and NOT return a refresh token', function(done){
      accessForm.scope = 'undefined';
      req.postEndpoint('/api/v1/oauth/token', basic, refreshForm, function(err, res){
        //validate response with chai before calling done
        val.success(res);
        val.validateAccessToken(res);
        done();
      });
    });
      
  });
  
  describe('POST /users', function(){
    /**
      - Authenticate client
      - Return a new user upon creation
    **/    
    it('should create a new user', function(done){
      //make sure all fields are in correct form first
      userData.username = 'testUser';
      userData.password = 'Passw0r$';
      req.postEndpoint('/api/v1/users', basic, userData, function(err,res){
        val.success(res);
        val.validateUserObject(res);
        user = res.body.data;
        done();
      });
    });

  });
  
  describe('GET /users', function(){
    
    before(function(done){
      bearer['Authorization'] = 'Bearer ' + token.value;
      done();
    });

    after(function(done){
      //remove created user
      User.findByIdAndRemove(user._id, function(err){
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
    it('should return a list of all users', function(done){
      //no data sent
      req.getEndpoint('/api/v1/users', bearer, null, function(err,res){
        val.success(res);
        val.validateUserList(res);
        done();
      });
    });
  
  
    describe('GET /users/:username', function(){
      /**
        - Authenticate the Bearer "Access" Token
        - Return one user specified in params list - no data sent
      **/
      it('should return a specific user full information', function(){
        //authenticated user
        req.getEndpoint('/api/v1/users/'+ userData.username, bearer, null, function(err,res){
          val.success(res);
          val.validateUserObject(res);
        }); 
      });

      it('should return a specific user limited information', function(){
        userData.username = 'test'; //other user
        req.getEndpoint('/api/v1/users/'+ userData.username, bearer, null, function(err,res){
          val.success(res);
          val.validateUserLimitedObject(res);
          done();
        }); 
      });

    });

  });

});
