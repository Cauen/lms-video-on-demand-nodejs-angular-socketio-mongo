require('../config/passport');
var jwt_auth_key = require('../config/jwt_auth');

var jwt = require('express-jwt');
var jwt2 = require('jsonwebtoken');
var auth = jwt({
  secret: jwt_auth_key,
  userProperty: 'payload'
});

module.exports = auth;