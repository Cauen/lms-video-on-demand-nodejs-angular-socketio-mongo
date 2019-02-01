var express = require('express');
var passport = require('passport');
var authRoutes = express.Router();

let User = require('../models/User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

authRoutes.route('/login').post(function (req, res, next) {
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found1
      res.status(401).json(info);
    }
  })(req, res, next);
});

authRoutes.route('/register').post(function (req, res) {
  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;

  console.log(req);
  user.setPassword(req.body.password);
  
  user.save()
  .then(user => {
    //res.status(200).json({'user': 'user in added successfully'});
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  })
  .catch(err => {
    res.status(400).send(err);
  });

});

module.exports = authRoutes;