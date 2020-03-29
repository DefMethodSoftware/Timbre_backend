const express = require('express');
const passport = require('passport')
const IncomingUserParamValidator = require('../helpers/user/IncomingUserParamValidator')
const UserController = require('../controllers/UserController')
const createError = require('http-errors');

const router = express.Router();

router.post('/users', async function(req, res, next) {
  try {
    new IncomingUserParamValidator(req.body)
  } catch (e) {
    res.status(400).json(e)
    next()
  }
  UserController.createUserAction(req.body, res, next)
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
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      if (user.id !== req.params.id ) {
        next(createError(401, "Not authorized to edit user"))
      }
      UserController.updateUserAction(user, req.body, res, next)
      return
    }
    return res.status(403).json(info)
  })(req, res, next)
})

// router.get(){
//   //get user in regards to user who created membership request.
// }

module.exports = router;
