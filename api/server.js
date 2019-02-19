const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB');

//Middlewares
const adminMiddleware = require('./middlewares/admin');
const myselfMiddleware = require('./middlewares/myself');
const loggedMiddleware = require('./middlewares/logged');

//Routes
const videoRoute = require('./routes/video.route');
const courseRoute = require('./routes/course.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

// Connect DB
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

//Multer imports + Upload
const multer = require("multer");
const myFileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4)$/)) 
    return cb(new Error('Only image files are allowed!'), false);
  
  cb(null, true);
};
const UPLOAD_PATH = 'videos';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: myFileFilter });
const videoUploadOptions = upload.fields([{
  name: 'file', maxCount: 1
}, {
  name: 'filethumb', maxCount: 1
}]);

// Initializing Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

//Video Routes
app.get(    '/video/watch/:id',                             videoRoute.watchID);
app.get(    '/video/thumb/:id',                             videoRoute.thumbID);
app.get(    '/video/data/:id',            loggedMiddleware, videoRoute.dataId);
app.get(    '/video/comments/:id',        loggedMiddleware, videoRoute.commentsId);
app.post(   '/video/comment/:id',         loggedMiddleware, videoRoute.commentId);
app.get(    '/video/search/:query',       loggedMiddleware, videoRoute.getVideosByNameOrDesc);
app.post(   '/video/upload/',             adminMiddleware,  videoUploadOptions, videoRoute.upload);

// Course Routes
app.get(    '/course/getall',             loggedMiddleware, courseRoute.getAllCoursesAndVideos);
app.get(    '/course',                    loggedMiddleware, courseRoute.getAllCoursesIdAndName);
app.get(    '/course/:id',                loggedMiddleware, courseRoute.getCourseByID);
app.get(    '/course/courseandvideo/:id', loggedMiddleware, courseRoute.getCourseAndVideosByID);
app.get(    '/course/search/:query',      loggedMiddleware, courseRoute.findCourseByNameDescTag);
app.delete( '/course/:id',                adminMiddleware,  courseRoute.deleteVideoByID);
app.put(    '/course/reorder',            adminMiddleware,  courseRoute.putVideoReorderByID);
app.put(    '/course/update',             adminMiddleware,  courseRoute.putVideoDetailsByID);
app.post(   '/course/',                   adminMiddleware,  courseRoute.postCourse);

// Public User Registration and Login Routes
app.use(    '/auth',                                        authRoute);

// User Routes
app.post(   '/user/add',                  adminMiddleware,  userRoute.addUser);
app.put(    '/user/:id',                  myselfMiddleware, userRoute.putUserByID);
app.get(    '/user',                      adminMiddleware,  userRoute.getAllUsers);
app.get(    '/user/:id',                  myselfMiddleware, userRoute.getUserByID);
app.get(    '/user/lastwatched/:id',      myselfMiddleware, userRoute.getLastWatchedVideoByUserID);
app.post(   '/user/setvideotiming',       myselfMiddleware, userRoute.setUserTimingByID);
app.get(    '/user/videotime/:uid/:vid',  loggedMiddleware, userRoute.getVideoTimingsByID);
app.get(    '/user/getvideostimings/:uid',loggedMiddleware, userRoute.getVideosTimingsByID);
app.delete( '/user/:uid',                 adminMiddleware,  userRoute.deleteUserByID);

// Server
const port = process.env.PORT || 4000;
const server = app.listen(port, '192.168.1.4');