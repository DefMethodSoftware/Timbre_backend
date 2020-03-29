const express = require('express');
const passport = require('passport');
const BandController = require('../controllers/BandController')
const createError = require('http-errors');

const router = express.Router();

router.post('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      BandController.createBandAction(user, req.body, res, next)
      return
    }
    return next(createError(403, info))
  })(req, res, next)
})

router.get('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      BandController.viewBandsAction(user, res, next)
      return
    }
    return next(createError(403, info))
  })(req, res, next)
})

module.exports = router;
