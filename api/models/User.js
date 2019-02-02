const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

// Define collection and schema for User
let User = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  name: {
    type: String,
    required: true
  },
  role: String,
  hash: String,
  salt: String,
  preferences: [{ type : Schema.Types.ObjectId, ref: 'Course' }],
  watching: [{
    video: { 
      type : Schema.Types.ObjectId, 
      ref: 'Video',
    }, 
    secondswatched: {
      type: Number,
      required: true,
    },
    percent: {
      type: Number
    }
  }],
  updated: { type: Date, default: Date.now },
},{
    collection: 'user'
});

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

User.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

User.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


module.exports = mongoose.model('User', User);