const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Video
let Video = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [String],
  course: { type : Schema.Types.ObjectId, ref: 'Course' },
  module: { type : Schema.Types.ObjectId, ref: 'Module' },
  fileThumbDirURL: String,
  fileDirURL: {
    type: String,
    required: true
  },
  thumbnailDirURL: String,
  originalFileName: String,
  fileType: String, 
  fileSize: Number,
  videoDuration: Number,
  comments: [{
    user: { type: String },
    content: {type: String },
    commentedAt: { type: Date, default: Date.now }
  }],
  
  uploaded: { type: Date, default: Date.now },
},{
    collection: 'video'
});

module.exports = mongoose.model('Video', Video);