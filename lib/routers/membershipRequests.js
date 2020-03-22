const express = require('express');
const MembershipRequest = require('../models/MembershipRequest');
const User = require('../models/User')
const Band = require('../models/Band')
const passport = require('passport');
const mongoose = require('mongoose')
const MembershipRequestValidator = require('../helpers/MembershipRequest/MembershipRequestValidator.js')
const MembershipRequestCreator = require('../helpers/MembershipRequest/MembershipRequestCreator.js')

const router = express.Router();

router.post('/bands/:id/membership_requests', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      Band.findById(req.params.id, function(err, band) {
        if(err){
          return res.status(400).send(err)
        }
	if (MembershipRequestValidator.validateNewRequest(authUser, band)) {
	  MembershipRequestCreator.create(authUser, band, () => {
            res.status(201).send()
	  })
	} else {
	  res.status(400).send()
	}
      })
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

router.get('/membership_requests', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, authUser, info) => {
    if (err) {
      return next(err)
    }
    if (authUser) {
      if (authUser.bands.length < 1) {
	return res.status(400).send()
      }
      const totalRequests = await MembershipRequest.find()
	    .where('band')
	    .in(authUser.bands)
	    .and([{ accepted: false }, { declined: false }])
	    .exec()
      return res.status(200).send({ membershipRequests: totalRequests })
    }
    return res.status(401).json(info)
  })(req, res, next)
})

router.patch('/bands/:bandId/membership_requests/:id', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      Band.findById(req.params.bandId, function(err, band) {
        if(err){
          return res.status(400).send(err)
        }
        if (!authUser.bands.includes(band.id)) {
          return res.status(401).send({ message: "You do not own this band!" })
        }

        MembershipRequest.findById(req.params.id, function(err, membershipRequest) {
          if(err){
            return res.status(400).send(err)
          }
	  if(membershipRequest.accepted || membershipRequest.declined) {
	    return res.status(400).send()
	  }
          membershipRequest.setRequestStatus(req.body)
          membershipRequest.save()
          .then(() => {
            res.status(200).send({ success: true })
          })
          .catch((err)=>{res.status(500).send(err)})
        })
        return
      })
      return
    }
    return res.status(401).json(info)
  })(req, res, next)
})

module.exports = router;
