const express = require('express');
const app = express();
const courseRoutes = express.Router();

// Require Course model in our routes module
let Course = require('../models/Course');
let Video = require('../models/Video');

var ObjectId = require('mongodb').ObjectID;

// Defined store route
module.exports.postCourse = (function (req, res) {
  let course = new Course(req.body);
  course.save()
    .then(course => {
      console.log('course added');
      res.status(200).json({ 'course': 'course in added successfully' });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports.findCourseByNameDescTag = (function (req, res) {
  let query = req.params.query;
  let regex = new RegExp(query, 'i');
  Course.find({
    $or: [
      { name: regex },
      { description: regex },
      { tags: regex }
    ]
  }, (err, courses) => {
    if (!courses)
      return next(new Error('Could not load Document'));

    res.send(courses);
  });
})

module.exports.getAllCoursesIdAndName = (function (req, res) {
  Course.find(function (err, courses) {
    if (err) {
      return res.send(err);
    }
    else {
      res.json(courses.map(course => {
        return { _id: course._id, name: course.name };
      }));
    }
  });
});

module.exports.getAllCoursesAndVideos = (async function (req, res) {
  await Course.find().populate('videos').exec(function (err, courses) {
    if (err) {
      console.log('Error')
      return false;
    }
    res.json(courses);
  });
});

module.exports.getCourseByID = (function (req, res) {
  let id = req.params.id;
  Course.findById(id, function (err, course) {
    if (err) {
      return res.send(err);
    }
    res.json(course);
  });
});

module.exports.getCourseAndVideosByID = (function (req, res) {
  let id = req.params.id;
  Course.findById(id).populate('videos').exec(function (err, course) {
    if (err)
      return res.status(404).json(err);
    var videos = course.videos.map(video => {
      return { _id: video._id, name: video.name, fileThumbDirURL: video.fileThumbDirURL, videoDuration: video.videoDuration, description: video.description }
    })
    res.json({ name: course.name, description: course.description, videos: videos, tags: course.tags });
  });
});

module.exports.putVideoDetailsByID = (function (req, res) {

  let courseId = req.body.id;
  let courseName = req.body.name;
  let courseDescription = req.body.description;
  var courseTags = req.body.tags;

  Course.findById(courseId, function (err, course) {
    if (!course)
      return next(new Error('Could not load Document'));
    else {
      course.name = courseName;
      course.description = courseDescription;
      course.tags = courseTags;

      course.save().then(course => {
        res.json('Update complete');
      }).catch(err => {
        res.status(400).send("unable to update the database");
      });
    }
  });
});

module.exports.putVideoReorderByID = (function (req, res) {

  let courseId = req.body.id;
  let courseVideos = req.body.videos;
  Course.findById(courseId, function (err, course) {
    if (!course)
      return next(new Error('Could not load Document'));
    else {
      course.videos = courseVideos;

      course.save().then(course => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
module.exports.deleteVideoByID = (function (req, res) {
  Course.findByIdAndRemove({ _id: req.params.id }, function (err, course) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});
