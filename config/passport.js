const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const mongoose = require('mongoose')
const User = mongoose.model('User')
const secret = require('./index').secret

const fromHeader = (req) => {
  let header = req.headers.authorization
  return header ? req.headers.authorization : null
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  User.findOne({email: email}).then(async (user)=>{
    const valid = await user.validPassword(password)
    if(!user || !valid){
      return done(null, false, {errors: "email or password is invalid"})
    }
    return done(null, user)
  }).catch(err => {done(null, false, err)})
}))

passport.use(new JWTStrategy({
  jwtFromRequest: fromHeader,
  secretOrKey: secret,
}, (jwt_payload, done) => {
  User.findOne({email: jwt_payload.email}, async (err, user) => {
    if (err) {
      return done(err, false)
    }
    if (user) {
      await User.populate(user, 'location')
      return done( null, user)
    }
    else {
      return done(null, false)
    }
  }).catch(err => {done(null, false, err)})
}))
