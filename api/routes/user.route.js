const express = require('express');
const app = express();
const userRoutes = express.Router();
var ObjectId = require('mongodb').ObjectID;

let User = require('../models/User');

module.exports.addUser = (function (req, res) {
  let user = new User(req.body);
  user.save()
    .then(user => {
      res.status(200).json({ 'user': 'user in added successfully' });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports.getAllUsers = (function (req, res) {
  User.find(function (err, useres) {
    if (err)
      console.log(err);
    else
      res.json(useres);

  });
});

// Defined edit route
module.exports.getUserByID = (function (req, res) {
  let id = req.params.id;
  User.findById(id, function (err, user) {
    res.json(user);
  });
});

// Defined edit route
module.exports.getLastWatchedVideoByUserID = (function (req, res) {
  let id = req.params.id;
  User.findById(id).populate('watching.video').populate('watching').exec(function (err, user) {
    if (!user)
      return res.status(404).json({ error: 'User not found' });
    var watch = (user.watching.map(watch => {
      return watch;
    }));
    // Return only already watched
    watch = watch.filter(wat => { if (wat.updated) return true; else return false; })
    // Sort by last watched, and pick first
    watch.sort(function (a, b) { return b.updated.getTime() - a.updated.getTime() });
    if (watch[0] && watch[0].percent < 90)
      res.json(watch[0]);
    else
      res.json({});
  });
});

//  Defined update route
module.exports.putUserByID = (function (req, res) {
  User.findById(req.params.id, function (err, user) {
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
module.exports.setUserTimingByID = (function (req, res) {
  var userid = req.body.userid;
  User.findById(userid, function (err, user) {
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
          user.watching[i].percent = timing / videoduration * 100;
          user.watching[i].updated = new Date();
          foundVideo = true;
        }
      }
      if (!foundVideo)
        user.watching.push({ video: v_id, secondswatched: timing, updated: new Date() });
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
module.exports.getVideoTimingsByID = (function (req, res) {
  var userid = req.params.uid;
  var videoid = req.params.vid;
  User.findById(userid, function (err, user) {
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
module.exports.getVideosTimingsByID = (function (req, res, next) {
  var userid = req.params.uid;
  User.findById(userid, function (err, user) {
    if (!user)
      return res.status(404).json(err);
    else {
      var videosPercents = [];
      //return res.json(user.watching)
      for (var i = 0; i < user.watching.length; i++) {
        console.log("pushing " + user.watching[i].secondswatched + " at pos " + user.watching[i].video)
        //videosPercents[user.watching[i].video] = user.watching[i].secondswatched;
        videosPercents.push({ videoid: user.watching[i].video, percent: user.watching[i].percent })
      }
      return res.json(videosPercents);
    }
  });
});

// Defined delete | remove | destroy route
module.exports.deleteUserByID = (function (req, res) {
  User.findByIdAndRemove({ _id: req.params.uid }, function (err, user) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});
