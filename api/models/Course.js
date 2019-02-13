const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Course
let Course = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [String],
  modules: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tags: [String],
    videos: [{ type : Schema.Types.ObjectId, ref: 'Video' }],
    
    created: { type: Date, default: Date.now },
  }],
  videos: [{ type : Schema.Types.ObjectId, ref: 'Video' }],
  
  created: { type: Date, default: Date.now },
},{
    collection: 'course'
});

module.exports = mongoose.model('Course', Course);