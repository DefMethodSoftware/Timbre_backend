const mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  instrument: String,
  genre: Array,
  proficiency: String,
  preferences: Array,
  bio: String
}, {timestamps: true});

mongoose.model('User', UserSchema);
