const express = require('express');
const app = express();
const courseRoutes = express.Router();

// Require Course model in our routes module
let Course = require('../models/Course');
let Video = require('../models/Video');

var ObjectId = require('mongodb').ObjectID;

// Defined store route
courseRoutes.route('/add').post(function (req, res) {
  let course = new Course(req.body);
  course.save()
    .then(course => {
      res.status(200).json({ 'course': 'course in added successfully' });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// Defined get data(index or listing) route
courseRoutes.route('/').get(function (req, res) {
  Course.find(function (err, courses) {
    if (err) {
      console.log(err);
    }
    else {
      var returnCourses = [];
      courses.forEach(function (value, key) {
        returnCourses.push({ name: courses[key].name, id: courses[key]._id });
      });
      res.json(returnCourses);
    }
  });
});

/*
// Defined get data(index or listing) route
courseRoutes.route('/getall').get(async function (req, res) {
  await Course.find(async function (err, courses){
    if(!courses){
      res.json({success: false, message: "No Courses Found."});
      return;
    }
    
    for (key in courses) {
      var id = courses[key]._id;
      var o_id = new ObjectId(id);
      courses[key].videos = [];
      const myVideos = await Video.find({course: o_id}, function(err, videos) {
        if (videos) {
            courses[key].videos = videos;
            console.log("Video: " + JSON.stringify(videos._id))
          
        } else {
          courses[key].videos = [];
        }
      });
    }

    console.log('Returning');
    console.log(courses);
    res.json(courses);
    
  });
}); */

// Defined get data(index or listing) route
courseRoutes.route('/getall').get(async function (req, res) {
  await Course.find().populate('videos').exec(function (err, courses) {
    if (err) {
      console.log('Error')
      return false;
    }
    res.json(courses);
  });
});

// Defined edit route
courseRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Course.findById(id, function (err, course) {
    res.json(course);
  });
});

//  Defined update route
courseRoutes.route('/update/:id').post(function (req, res) {
  Course.findById(req.params.id, function (err, course) {
    if (!course)
      return next(new Error('Could not load Document'));
    else {
      course.person_name = req.body.person_name;
      course.course_name = req.body.course_name;
      course.course_gst_number = req.body.course_gst_number;

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
courseRoutes.route('/delete/:id').get(function (req, res) {
  Course.findByIdAndRemove({ _id: req.params.id }, function (err, course) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = courseRoutes;