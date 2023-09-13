const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const tagSchema = new Schema({
   tag: {
      type: [String], // Define the type as an array of strings
      default: []
    }
})

module.exports = mongoose.model('Tag', tagSchema);
