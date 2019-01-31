const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');

//AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE DEUUU
require('./config/passport');

var jwt = require('express-jwt');
var jwt2 = require('jsonwebtoken');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

const videoRoute = require('./routes/video.route');
const courseRoute = require('./routes/course.route');
const userRoute = require('./routes/user.route');
const moduleRoute = require('./routes/module.route');
const authRoute = require('./routes/auth.route');
const testRoute = require('./routes/test.route');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

//Multer imports
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
const videoUploadOptions = upload.fields([{
  name: 'file', maxCount: 1
}, {
  name: 'filethumb', maxCount: 1
}]);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/course', auth, courseRoute );
app.use('/module', moduleRoute);
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use('/auth', myLogger, authRoute);

var testUser = function(req,res, next){
  if (req.headers && req.headers.authorization) {
    var authorization;
    var decoded;
    var getUsetId = req.headers.userid;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      authorization = req.headers.authorization.split(' ')[1];
    } else {
      return res.send('Sem token');
    }
    try {
      var decoded = jwt2.verify(authorization, 'MY_SECRET');
      console.log(JSON.stringify(decoded))
      
    } catch(err) {
      console.log(err);
      return res.sendStatus(401);
    }
    if (decoded) {
      var userId = decoded.id;
      if (userId == getUsetId)
        next();
      else 
        return res.sendStatus(401);
    }
  }
}
app.use('/user', testUser, userRoute);
app.get('/test', testUser, testRoute.testtrue);
//Video routes separated because some needs JWT, some not
app.get('/video/watch/:id', videoRoute.watchID);
app.get('/video/thumb/:id', videoRoute.thumbID);
app.get('/video/data/:id', videoRoute.dataId);
app.get('/video/comments/:id', videoRoute.commentsId);
app.post('/video/comment/:id', videoRoute.commentId);
app.post('/video/upload/', auth, videoUploadOptions, videoRoute.upload);

const port = process.env.PORT || 4000;

const server = app.listen(port, '192.168.1.9');