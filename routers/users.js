const express = require('express');
const User = require('../models/User')
const passport = require('passport')
const auth = require('./auth')

const router = express.Router();

router.post('/users', async (req, res, next) => {
  let user = new User(req.body)
  user.setPassword(req.body.password)
  user.save().then(()=>{
    res.status(201).send(user.toAuthJSON())
  }).catch(next)
})

router.post('/users/login', function(req, res, next) {
  passport.authenticate('local', {session: false}, function(err, user, info) {
    if(err) {
      return next(err)
    }
    if(user){
      return res.json({user: user.toAuthJSON()})
    } else {
      return res.status(422).json(info)
    }
  })(req, res, next)
})

module.exports = router;
