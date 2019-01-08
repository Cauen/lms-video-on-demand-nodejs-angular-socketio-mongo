const express = require('express');
const app = express();
const videoRoutes = express.Router();

const multer = require("multer");
var ObjectId = require('mongodb').ObjectID;

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

// Defined store route
videoRoutes.route('/add').post(function (req, res) {
  let video = new Video(req.body);
  video.save()
    .then(video => {
      res.status(200).json({'video': 'video in added successfully'});
    })
    .catch(err => {
    res.status(400).send(err);
    });
});

// Defined get data(index or listing) route
videoRoutes.route('/').get(function (req, res) {
    Video.find(function (err, videoes){
    if(err){
      console.log(err);
    }
    else {
      res.json(videoes);
    }
  });
});

// Defined delete | remove | destroy route
videoRoutes.route('/delete/:id').get(function (req, res) {
  Video.findByIdAndRemove({_id: req.params.id}, function(err, video){
      if(err) res.json(err);
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

videoRoutes.route('/thumb/:id').get(function (req, res) {
  let id = req.params.id;
  var videoURL;
  Video.findById(id, function (err, video){
      if (!video)
        return res.status(404).send('Video not found');

        const path = 'videos/'+video.fileThumbDirURL;
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
videoRoutes.route('/watch/:id').get(function (req, res) {
  let id = req.params.id;
  var videoURL;
  Video.findById(id, function (err, video){
      if (!video)
        return res.status(404).send('Video not found');

      videoURL = (video.fileDirURL);
      console.log(JSON.stringify(video));

      const path = 'videos/'+videoURL
      const stat = fs.statSync(path);
      const fileSize = stat.size
      const range = req.headers.range
      console.log('Range: ' + range)
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        
        file.on('data', data => {
          //console.log('OnData' );
          //console.log(Date.now());
          //file.destroy();
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
        console.log('START: ' + start);
        console.log('END: ' + end);
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

videoRoutes.route('/upload').post(upload.fields([{
  name: 'file', maxCount: 1
}, {
  name: 'filethumb', maxCount: 1
}]), function(req, res){
  var name = req.body.name;
  var description = req.body.description;
  var tags = req.body.tags;
  var course = req.body.course;

  if (!req.files.file || !req.files.filethumb) 
    return res.status(400).send('Image or video needed');
  
  let video = new Video( 
    {
      name: name, 
      description: description, 
      tags:tags,
      fileThumbDirURL: req.files.filethumb[0].filename, 
      fileDirURL: req.files.file[0].filename, 
      originalFileName: req.files.file[0].originalname,
      fileType: req.files.file[0].mimetype,
      fileSize: req.files.file[0].size,
      course: course
    });
  video.save()
    .then(video => {
      res.status(200).json({'video': 'Video in added successfully ' + req.files.file[0].filename});
    })
    .catch(err => {
      res.status(400).send(err);
    });

})

/*
// Defined store route
videoRoutes.route('/comment').post(function (req, res) {
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

//  Defined update route
videoRoutes.route('/comment/:id').post(function (req, res) {
  Video.findById(req.params.id, function(err, video) {
  if (!video)
    return next(new Error('Could not load Document'));
  else {
      video.comments.push({user: req.body.user, content:req.body.content});

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
videoRoutes.route('/comments/:id').get(function (req, res) {
  Video.findById(req.params.id, function(err, video) {
    if (!video)
      return res.status(400).send("No video found!");
    else {
        res.status(200).send(video.comments);
    }
  });
});

//getVideos

//  Defined update route
videoRoutes.route('/ofcourse/:courseid').get(function (req, res) {
  var id = req.params.courseid;       
  var o_id = new ObjectId(id);
  Video.find({course: o_id}, function(err, video) {
    if (!video)
      return res.status(400).send("No video found!");
    else {
      res.status(200).send(video);
    }
  });

});

module.exports = videoRoutes;