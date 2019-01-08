const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Module
let Module = new Schema({
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
},{
    collection: 'module'
});

module.exports = mongoose.model('Module', Module);