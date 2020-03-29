const express = require('express');
const MembershipRequest = require('../models/MembershipRequest');
const passport = require('passport');
const mongoose = require('mongoose')
const MembershipRequestController = require('../controllers/MembershipRequestController')
const BandConverter = require('../helpers/Band/BandConverter')
const MembershipRequestConverter = require('../helpers/MembershipRequest/MembershipRequestConverter')
const createError = require('http-errors');

const router = express.Router();

router.post('/bands/:id/membership_requests', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      try {
        const band = await BandConverter(req.params.id)
        MembershipRequestController.createMembershipRequestAction(user, band, res, next)
      } catch (e) {
        next(createError(400, e.message))
      }
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

router.get('/membership_requests', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) {
      MembershipRequestController.viewMembershipRequestsAction(user, res, next)
      return        
    }
    return res.status(401).json(info)
  })(req, res, next)
})

router.patch('/bands/:bandId/membership_requests/:id', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      try {
        const band = await BandConverter(req.params.bandId)
        const membershipRequest = await MembershipRequestConverter(req.params.id)
        MembershipRequestController.updateMembershipRequestAction(user, band, membershipRequest, req.body, res, next)
      } catch (e) {
        next(createError(400, e.message))
      }
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

module.exports = router;
