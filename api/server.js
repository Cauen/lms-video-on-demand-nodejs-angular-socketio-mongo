const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');

//AEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE DEUUU
require('./config/passport');

var jwt = require('express-jwt');
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

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/video', videoRoute);
app.use('/course', auth, courseRoute );
app.use('/user', userRoute);
app.use('/module', moduleRoute);
app.use('/auth', authRoute);
app.get('/test/true', testRoute.testtrue)
app.get('/test/false', testRoute.testfalse)
const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});