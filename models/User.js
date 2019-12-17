const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret


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

UserSchema.methods = {
  setPassword: (password) => {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  },

  validPassword: (password) => {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
  },

  generateJWT: () => {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 60)
  
    return jwt.sign({
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    }, secret)
  },

  toAuthJSON: () => {
    return {
      email: this.email,
      token: this.generateJWT()
    }
  }
}

// UserSchema.methods.setPassword = (password) => {
//   this.salt = crypto.randomBytes(16).toString('hex')
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
// }

// UserSchema.methods.validPassword = (password) => {
//   let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
//   return this.hash === hash
// }

// UserSchema.methods.generateJWT = () => {
//   let today = new Date()
//   let exp = new Date(today)
//   exp.setDate(today.getDate() + 60)

//   return jwt.sign({
//     id: this._id,
//     email: this.email,
//     exp: parseInt(exp.getTime() / 1000),
//   }, secret)
// }

mongoose.model('User', UserSchema);