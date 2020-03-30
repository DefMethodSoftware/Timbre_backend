const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken')
const secret = require('../../config').secret
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  password: {type: String, require: [true, "can't be blank"]},
  username: {type: String, unique: true, required: [true, "can't be blank"], index: true},
  firstName: String,
  lastName: String,
  instruments: Array,
  genre: Array,
  preferences: Array,
  bio: String,
  location: Object,
  bands: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Band"
    },
  ]
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

UserSchema.methods = {
  validPassword: async function(password) {
    try {
      const isPasswordMatch = await bcrypt.compare(password, this.password)
      return isPasswordMatch
    } catch (e) {
      console.log(e)
    }
    return false
  },

  generateJWT: function() {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 60)
    let opts = {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    }
    return jwt.sign(opts, secret)
  },

  toAuthJSON: function() {
    return {
      email: this.email,
      userId: this.id,
      token: this.generateJWT()
    }
  },
  setProfile: function(params) {
    Object.keys(params).forEach((key)=>{
      this[key] = params[key]
    })
  },
  ownsBand: function(band) {
    return this.getBands().some((userBand)=>{
      return band.id == userBand._id
    })
  },
  addBand: function(band) {
    this.bands.push(band)
  },
  getBands: function() {
    return this.bands
  },
  getInstruments: function() {
    return this.instruments
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User
