const express = require('express');
const Band = require('../models/Band');
const User = require('../models/User')
const MembershipRequest = require('../models/MembershipRequest')
const passport = require('passport');

const router = express.Router();

router.post('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      let params = req.body
      params.location = user.location.coords
      params.locationFriendly = user.location.friendlyLocation
      let band = new Band(params)
      band.save().then(()=>{
        return User.findByIdAndUpdate(
          user._id,
          { $addToSet: { bands: band._id } },
          { new: true, useFindAndModify: false },
          (err, user) => {
            if (err) {
              return res.status(500).send({ message: "Update user object failed" })
            }
            if (!user) {
              return res.status(422).send({ message: "Find user failed"})
            }
            return res.status(201).send({ message: "Band created successfully" })
          })
      })
      .catch((err)=>{res.status(500).send(err)})
      return
    }
    return res.status(422).json(info)
  })(req, res, next)
})

router.get('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      let findParams = []
      user.instruments.map((instrument)=>{
        findParams.push({ [`missingInstruments.${instrument.instrument}`]: { $exists : true } })
      })
      let memberships = await MembershipRequest.find({user_id: user._id}, {band_id: 1, _id: 0})
      memberships = memberships.map((band)=>{
        return band.band_id
      })
      let bands = await Band.find()
                            .or(findParams)
                            .and({
                              location: {
                                $near :
                                  {
                                    $geometry: {
                                      type: "2d",
                                      coordinates: user.location.coords
                                    },
                                    $maxDistance: 1000
                                  },
                              }
                            }).and ({
                              _id:{$nin:memberships}
                            })
                            // .and(those bands with mmebership requests dont appear)
      return res.status(200).send({bands: bands})
    }
    return res.status(422).json(info)
  })(req, res, next)
})

module.exports = router;
