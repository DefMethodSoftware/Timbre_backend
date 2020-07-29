const express = require('express');
const passport = require('passport');
const createError = require('http-errors');
const MembershipRequestController = require('../../controllers/MembershipRequestController')
const BandConverter = require('../../helpers/Band/BandConverter')
const MembershipRequestConverter = require('../../helpers/MembershipRequest/MembershipRequestConverter')

const router = express.Router();

router.post('/v1.0/bands/:id/membership_requests', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      try {
        const band = await BandConverter(req.params.id)
        MembershipRequestController.createMembershipRequestAction(user, band, res, next)
      } catch (e) {
        next(createError(400, e))
      }
      return
    }
    return res.status(403).json(info)
  })(req, res, next)
})

router.get('/v1.0/membership_requests', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) {
      MembershipRequestController.viewMembershipRequestsAction(user, res, next)
      return
    }
    return next(createError(403, info))
  })(req, res, next)
})

router.patch('/v1.0/bands/:bandId/membership_requests/:id', (req, res, next) => {
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
        next(createError(400, e))
      }
      return
    }
    return next(createError(403, info))
  })(req, res, next)
})

module.exports = router;
