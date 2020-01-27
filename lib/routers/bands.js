const express = require('express');
const Band = require('../models/Band');
const User = require('../models/User')
const passport = require('passport');

const router = express.Router();

router.post('/bands', async function(req, res, next) {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) {
      return next(err)
    }
    if(user){
      let band = new Band(req.body)
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

module.exports = router;