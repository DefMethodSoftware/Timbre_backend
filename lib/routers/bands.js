const express = require('express');
const passport = require('passport');
const BandController = require('../controllers/BandController')

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
    return res.status(401).json(info)
  })(req, res, next)
})

router.get('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      BandController.viewBandsAction(user, res)
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

module.exports = router;
