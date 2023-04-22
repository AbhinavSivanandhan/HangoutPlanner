const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true, //this just setps up an index, it is not validation
   }
});

userSchema.plugin(passportLocalMongoose); //adds username, hash, salt fields to the schema
module.exports = mongoose.model('User', userSchema);