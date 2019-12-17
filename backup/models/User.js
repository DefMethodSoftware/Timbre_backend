const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto')


let UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  hash: String,
  salt: String,
  firstName: String,
  lastName: String,
  instrument: String,
  genre: Array,
  proficiency: String,
  preferences: Array,
  bio: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});