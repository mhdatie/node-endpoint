'use strict';

var winston = require('winston'); //for logs
//common utils
var props = require('./common/properties');
var reqs = require('./common/request');
var val = require('./common/validate');

var token = ''; //global
var refreshToken = ''; //global

var basic = {'Authorization': 'Basic ' 
              + new Buffer(props.clientData.id + ':' + props.clientData.secret).toString('base64'),
              'Content-Type':'application/x-www-form-urlencoded'};

var bearer = {};


//Tests for OAuth ---------------------------------------------------------------------------------------
describe('Node API endpoints', function(){
  this.timeout(20000); //20 seconds timeout

  describe('POST /oauth/token', function(){
      
    it('should work and return a refresh token', function(done){
      props.accessForm.scope = 'offline_access';
      reqs.postEndpoint('/api/v1/oauth/token', basic, props.accessForm, function(err, res){
        //validate response with chai before calling done
        val.validateAccessRefreshToken(res);

        //set the global token and refresh token for following tests
        token = res.body.access_token.token.value;
        refreshToken = res.body.access_token.refreshToken.value;

        //exchange refresh token for a new access token
        props.refreshForm.refresh_token = refreshToken;
        reqs.postEndpoint('/api/v1/oauth/token', basic, props.refreshForm, function(err, res){
          //validate response with chai
          val.validateAccessToken(res);
          done();  
        });
        
      });
    });
    
    it('should work and NOT return a refresh token', function(done){
      props.accessForm.scope = 'undefined';
      reqs.postEndpoint('/api/v1/oauth/token', basic, props.refreshForm, function(err, res){
        //validate response with chai before calling done
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
      props.userData.username = 'testUser';
      props.userData.password = 'Passw0r$';
      reqs.postEndpoint('/api/v1/users', basic, props.userData, function(err,res){
        val.validateUserObject(res);
        done();
      });
    });

  });
  
  describe('GET /users', function(){
    
    before(function(done){
      bearer['Authorization'] = 'Bearer ' + token;
      done();
    });

    after(function(done){
      //todo: expire the token - token.expirationDate
      done();
    });

    /**
      - Authenticate the Bearer "Access" Token
      - Return a list of all users
    **/
    it('should return a list of all users', function(done){
      //no data sent
      reqs.getEndpoint('/api/v1/users', bearer, null, function(err,res){
        val.validateUserList(res);
        done();
      });
    });
  });
  
  describe('GET /users/:username', function(){
    /**
      - Authenticate the Bearer "Access" Token
      - Return one user specified in params list - no data sent
    **/
    it('should return a specific user full information', function(done){
      //authenticated user
      reqs.getEndpoint('/api/v1/users/'+props.userData.username, bearer, null, function(err,res){
        val.validateUserObject(res);
        done();
      }); 
    });

    it('should return a specific user limited information', function(done){
      props.userData.username = 'test'; //other user
      reqs.getEndpoint('/api/v1/users/'+props.userData.username, bearer, null, function(err,res){
        val.validateUserLimitedObject(res);
        done();
      }); 
    });

  });
  
  describe('Token Expiration Case', function(){
    /**
      - Attempt to get a user
      - The user's token has expired, use refresh token to get a new one
      - Get the user again
    **/
    it('should return false indicating an expired token and return a new one');
  });

});
