const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    video: { type : Schema.Types.ObjectId, ref: 'Video' }, percentage: {type: Number}
  }],
  updated: { type: Date, default: Date.now },
},{
    collection: 'user'
});

module.exports = mongoose.model('User', User);