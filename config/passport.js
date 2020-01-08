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
}, (email, password, done) => {
  User.findOne({email: email}).then((user)=>{
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}})
    }
    return done(null, user)
  }).catch(done)
}))

passport.use(new JWTStrategy({
  jwtFromRequest: fromHeader,
  secretOrKey: secret,
  algorithms: ["HS256"]
}, (jwt_payload, done) => {
  console.log(jwt_payload, "in jwt strat")
  User.findOne({email: jwt_payload.email}, function(err, user){console.log(err, user)})
  User.findOne({email: jwt_payload.email}, function(err, user) {
    if (err) {
      return done(err, false)
    }
    if (user) {
      return done( null, user)
    }
    else {
      return done(null, false)
    }
  })
}))