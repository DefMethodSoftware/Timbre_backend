const express = require('express');
const passport = require('passport')
const UserController = require('../controllers/UserController')
const createError = require('http-errors');

const router = express.Router();

router.post('/users', async function(req, res, next) {
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
      return next(createError(400, info))
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
    return next(createError(403, info))
  })(req, res, next)
})

// router.get(){
//   //get user in regards to user who created membership request.
// }

module.exports = router;
