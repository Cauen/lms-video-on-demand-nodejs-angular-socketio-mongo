const express = require('express');
const app = express();
const userRoutes = express.Router();
var ObjectId = require('mongodb').ObjectID;

// Require User model in our routes module
let User = require('../models/User');

// Defined store route
userRoutes.route('/add').post(function (req, res) {
    //let user = new User(req.body);
    let user = new User({username: 'emanuel', email: 'emanuel-caue14@hotmail.com', name: 'Emanuel', hash: '1jiasda8sd', salt: 'ajsd8asdj'});
  user.save()
    .then(user => {
      res.status(200).json({'user': 'user in added successfully'});
    })
    .catch(err => {
    res.status(400).send(err);
    });
});

// Defined get data(index or listing) routez
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, useres){
    if(err){
      console.log(err);
    }
    else {
      res.json(useres);
    }
  });
});

// Defined edit route
userRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  User.findById(id, function (err, user){
      res.json(user);
  });
});

//  Defined update route
userRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
        user.person_name = req.body.person_name;
        user.user_name = req.body.user_name;
        user.user_gst_number = req.body.user_gst_number;

        user.save().then(user => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

//  Defined update route
userRoutes.route('/setvideotiming').post(function (req, res) {
  var userid = req.body.userid;
  User.findById(userid, function(err, user) {
    if (!user)
      return next(new Error('User dont exist'));
    else {
        var videoid = req.body.videoid;
        var timing = req.body.timing;
        var videoduration = req.body.duration;
        var v_id = new ObjectId(videoid);
        console.log('Trying to save timing ' + videoid + " -> " + timing);
        
        var foundVideo = false;
        //Set watching
        for (var i = 0; i < user.watching.length; i++) {
            if (user.watching[i].video == videoid) {
              user.watching[i].secondswatched = timing;
              user.watching[i].percent = timing/videoduration * 100;
              foundVideo = true;
            }
        }
        if (!foundVideo)
          user.watching.push({video: v_id, secondswatched: timing});
        //user.watching= [{video: v_id, secondswatched: timing}];
        user.save().then(user => {
          res.json('Update complete user video timing');
      })
      .catch(err => {
        res.status(400).send(err);
      });
    }
  });
});

//  Defined update route
userRoutes.route('/getvideotimings').post(function (req, res) {
  var userid = req.body.userid;
  var videoid = req.body.videoid;
  User.findById(userid, function(err, user) {
    if (!user)
      return next(new Error('User dont exist'));
    else {
      for (var i = 0; i < user.watching.length; i++) {
        if (user.watching[i].video == videoid) {
          return res.json(user.watching[i].secondswatched);
        }
      }
      return res.json(false);
    }
  });
});

//  Defined update route
userRoutes.route('/getvideostimings').post(function (req, res, next) {
  var userid = req.body.userid;
  User.findById(userid, function(err, user) {
    if (!user)
    return next(new Error('User dont exist'));
    else {
      var videosPercents = [];
      //return res.json(user.watching)
      for (var i = 0; i < user.watching.length; i++) {
          console.log("pushing " + user.watching[i].secondswatched + " at pos " + user.watching[i].video)
          //videosPercents[user.watching[i].video] = user.watching[i].secondswatched;
          videosPercents.push({videoid: user.watching[i].video, percent: user.watching[i].percent})
      }
      return res.json(videosPercents);
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route('/delete/:id').get(function (req, res) {
    User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = userRoutes;