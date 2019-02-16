const express = require('express');
const app = express();
const videoRoutes = express.Router();

var ObjectId = require('mongodb').ObjectID;

const multer = require("multer");
const myFileFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const UPLOAD_PATH = 'videos';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: myFileFilter });

const fs = require('fs');

// Require Video model in our routes module
let Video = require('../models/Video');
let Course = require('../models/Course');

// Defined store route
module.exports.add = (function (req, res) {
  let video = new Video(req.body);
  video.save()
    .then(video => {
      Course.findById(req.params.id, function (err, course) {
        if (!course) {
          console.log("Course not loaded")
          return false;
        } else {
          course.videos.push(video.id);

          course.save().then(course => {
            res.json('Update complete on course videos list');
          })
            .catch(err => {
              res.status(400).send("unable to update the course database");
            });
        }
      });


      res.status(200).json({ 'video': 'video in added successfully' });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// Defined get data(index or listing) route
module.exports.default = (function (req, res) {
  Video.find(function (err, videoes) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(videoes);
    }
  });
});

// Defined delete | remove | destroy route
module.exports.deleteID = (function (req, res) {
  Video.findByIdAndRemove({ _id: req.params.id }, function (err, video) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});

var mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

module.exports.thumbID = (function (req, res) {
  let id = req.params.id;
  var videoURL;
  Video.findById(id, function (err, video) {
    if (!video)
      return res.status(404).send('Video not found');

    const path = 'videos/' + video.fileThumbDirURL;
    console.log(video.fileThumbDirURL)
    var type = mime[path.slice(1)] || 'text/plain';
    var s = fs.createReadStream(path);
    s.on('open', function () {
      res.set('Content-Type', type);
      s.pipe(res);
    });
    s.on('error', function () {
      res.set('Content-Type', 'text/plain');

      res.status(404).end(path);
    });
  });
});

// Defined delete | remove | destroy route
module.exports.watchID = (function (req, res) {
  let id = req.params.id;
  var videoURL;
  Video.findById(id, function (err, video) {
    if (!video)
      return res.status(404).send('Video not found');

    videoURL = (video.fileDirURL);
    console.log(JSON.stringify(video));

    const path = 'videos/' + videoURL
    if (!fs.existsSync(path))
      return res.status(404).send('File of video not found');

    const stat = fs.statSync(path);
    console.log(JSON.stringify(stat))
    const fileSize = stat.size
    const range = req.headers.range
    console.log('Range: ' + range)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      console.log(parts);
      const start = parseInt(parts[0], 10);
      //var start = 225050624;
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

      const chunksize = (end - start) + 1
      const file = fs.createReadStream(path, { start, end })

      console.log('SIZE: ' + fileSize)
      console.log('START: ' + start + ": " + start / fileSize);
      console.log('END: ' + end + ": " + end / fileSize);
      file.on('data', data => {
        //console.log('OnData' );
        //console.log(Date.now());
      });
      file.on('close', () => {

        console.log('OnClose');
        console.log(Date.now());
      });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  });


});

module.exports.upload = function (req, res) {
  var name = req.body.name;
  var description = req.body.description;
  var duration = req.body.duration;
  var tags = req.body.tags;
  var course = req.body.course;
  console.log('Tentando upload');

  console.log(JSON.stringify(req.file));

  if (!req.files || !req.files.file || !req.files.filethumb)
    return res.status(400).send('Image or video needed');

  console.log(req.files);
  let video = new Video(
    {
      name: name,
      description: description,
      tags: tags.split(','),
      fileThumbDirURL: req.files.filethumb[0].filename,
      fileDirURL: req.files.file[0].filename,
      originalFileName: req.files.file[0].originalname,
      fileType: req.files.file[0].mimetype,
      fileSize: req.files.file[0].size,
      videoDuration: duration,
      course: course
    });
  video.save()
    .then(video => {
      console.log(req.body.course)
      Course.findById(req.body.course, function (err, course) {
        if (!course) {
          res.status(404).send('Course not loaded');
          return false;
        } else {
          course.videos.push(video.id);
          console.log('Video pushed in course');
          course.save().then(course => {
            console.log('Update complete on course videos list');
            res.status(200).send('Update complete on course videos list');
          })
            .catch(err => {
              console.log("unable to update the course database");
              res.status(400).send(err);
            });
        }
      });

      console.log('Video pushed in Videos');
      //res.status(200).json({'video': 'Video in added successfully ' + req.files.file[0].filename});
    })
    .catch(err => {
      res.status(400).send('Error at uploading');
    });

}

/*
// Defined store route
module.exports.('/comment') = (function (req, res) {
  let video = new Video(req.body);
  video.save()
    .then(video => {
      res.status(200).json({'video': 'video in added successfully'});
    })
    .catch(err => {
    res.status(400).send(err);
    });
});
*/

//Search Videos
module.exports.getVideosByNameOrDesc = ((req, res) => {
  let query = req.params.query;
  let regex = new RegExp(query, 'i');
  Video.find({
    $or: [
      { name: regex },
      { description: regex },
      { tags: regex },
      { originalFileName: regex }
    ]
  }, (err, videos) => {
    if (!videos)
      return next(new Error('Could not load Document'));

    res.send(videos);
  });
});

//  Defined update route
module.exports.commentId = (function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (!video)
      return next(new Error('Could not load Document'));
    else {
      video.comments.push({ user: req.body.user, content: req.body.content });

      video.save().then(video => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//  Defined update route
module.exports.commentsId = (function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (!video)
      return res.status(400).send("No video found!");
    else {
      res.status(200).send(video.comments);
    }
  });
});


//  Defined update route
module.exports.dataId = (function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (!video)
      return res.status(400).send("No video found!");
    else {
      res.status(200).send(video);
    }
  });
});


//  Defined update route
module.exports.ofCourseId = (function (req, res) {
  var id = req.params.courseid;
  var o_id = new ObjectId(id);
  Video.find({ course: o_id }, function (err, video) {
    if (!video)
      return res.status(400).send("No video found!");
    else {
      res.status(200).send(video);
    }
  });

});
