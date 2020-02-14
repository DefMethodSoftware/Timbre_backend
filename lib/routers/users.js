const express = require('express');
const User = require('../models/User')
const passport = require('passport')

const router = express.Router();

router.post('/users', async function(req, res, next) {
  let user = new User(req.body)
  user.save().then(()=>{
    res.status(201).send(user.toAuthJSON())
  }).catch(next)
})

router.post('/users/login', function(req, res, next) {
  console.log(req.body)
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

router.patch('/users/:id', function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      User.findById(req.params.id, function(err, user){
        if(err) {
          return res.status(404).send(err)
        }
        if(user.id !== authUser.id) {
          return res.status(401).json({unauthorized: "Can't edit other user's profiles"})
        }
        user.setProfile(req.body)
        user.save()
        .then(()=>{
          res.status(200).send({success: true})
        })
        .catch((err)=>{res.status(500).send(err)})
      })
      return
    }
    return res.status(422).json(info)
  })(req, res, next)
})

// router.get(){
//   //get user in regards to user who created membership request.
// }

module.exports = router;
