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
          console.log(authUser)
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

// router.get(){
//   // get band membership requests
// }

router.patch('/bands/:bandId/membership_requests/:id', async function(req, res, next) {
  //accept decline band membership requests

  passport.authenticate('jwt', {session: false}, (err, authUser, info) => {
    if(err) {
      return next(err)
    }
    if(authUser){
      Band.findById(req.params.bandId, function(err, band) {
        if(err){
          console.log(err)
          return res.status(404).send(err)
        }
        if (!authUser.bands.includes(band.id)) {
          return res.status(403).send({ message: "You do not own this band!" })
        }

        MembershipRequest.findById(req.params.id, function(err, membershipRequest) {
          if(err){
            console.log(err)
            return res.status(404).send(err)
          }
          if (authUser.id != membershipRequest.user_id) {
            console.log(authUser.id, membershipRequest.user_id)
            return res.status(403).send({ message: "You cannot view this MembershipRequest!" })
          }

          membershipRequest.setRequestStatus(req.body.status)
          membershipRequest.save()
          .then(() => {
            res.status(200).send({success: true})
          })
          .catch((err)=>{res.status(500).send(err)})
        })
        return
      })
      return
    }
    return res.status(422).json(info)
  })(req, res, next)
})

module.exports = router;
