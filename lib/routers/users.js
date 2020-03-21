const express = require('express');
const User = require('../models/User')
const passport = require('passport')
const paramValidator = require('../helpers/user/IncomingUserParamValidator')

const router = express.Router();

router.post('/users', async function(req, res, next) {
  try {
    new paramValidator(req.body)
  } catch (e) {
    res.status(400).json(e)
    next()
  }

  let user = new User(req.body)
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
      return res.status(400).json(info)
    }
  })(req, res, next)
})

router.patch('/users/:id', function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      User.findById(req.params.id, function(err, user){
        if(err) {
          return res.status(400).send(err)
        }
        if(user.id !== authUser.id) {
          return res.status(401).json()
        }
	try {
	  verifyProfileInfo(req.body)
	} catch (err) {
	  return res.status(400).send(err)
	}
        user.setProfile(req.body)
        user.save()
        .then(()=>{
          res.status(204).send()
        })
        .catch((err)=>{res.status(500).send(err)})
      })
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

// router.get(){
//   //get user in regards to user who created membership request.
// }

const verifyProfileInfo = (profileInfo) => {
  if (!isValidCoords(profileInfo.location.coords)) {
    throw 'Bad location coordinates'
  }
}

const isValidCoords = ([long, lat]) => {
  if (long <= 180 &&
      long >= -180 &&
      lat <= 90 &&
      lat >= -90) {
    return true
  }
  
  return false
}
module.exports = router;
