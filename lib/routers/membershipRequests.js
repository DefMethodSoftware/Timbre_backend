const express = require('express');
const MembershipRequest = require('../models/MembershipRequest');
const User = require('../models/User')
const Band = require('../models/Band')
const passport = require('passport');

const router = express.Router();

router.post('/bands/:id/membership_requests', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      Band.findById(req.params.id, function(err, band) {
        if(err){
          return res.status(404).send(err)
        }
        let membershipRequest = new MembershipRequest({
          user_id: authUser.id, 
          band_id: band.id
        })
        membershipRequest.save().then(()=>{
          res.status(201).send({created: true})
        }).catch(next)
      })
      return
    }
    return res.status(422).json(info)
  })(req, res, next)
})