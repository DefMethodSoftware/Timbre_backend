const Band = require('../models/Band');
const User = require('../models/User')
const createError = require('http-errors');
const MembershipRequest = require('../models/MembershipRequest')
const IncomingBandParamConverter = require('../helpers/Band/IncomingBandParamConverter')

const createBandAction = async (user, body, res, next) => {
  try {
      var incomingBand = IncomingBandParamConverter(body, user)
    } catch (e) {
      next(createError(400, e))
      return 
    }
    let band = new Band(incomingBand)
    user.addBand(band)
    await band.save() 
    await user.save()
    return res.status(201).json("Band created successfully")
}

const viewBandsAction = async (user, res, next) => {
  if (!user.hasSetProfile()){
    next(createError(400, "User Profile Not Set"))
    return 
  }
  let userInstruments = []
  user.getInstruments().map((instrument)=>{
    userInstruments.push({ [`missingInstruments.${instrument.instrument}`]: { $exists : true } })
  })
  let memberships = await MembershipRequest.find({user_id: user.id}, {band_id: 1, _id: 0})
  memberships = memberships.map((band)=>{
    return band.band_id
  })
  let bands = await Band.find()
                        .or(userInstruments)
                        .and({
                          location: {
                            $near: {
                              $geometry: {
                                type: "Point",
                                coordinates: user.getLocation().coords
                              },
                              $maxDistance: 2000
                            },
                          }
                        })
                        .and ({
                          _id:{ $nin: memberships }
                        })
  return res.status(200).send({ bands: bands })
}

module.exports = {
  createBandAction: createBandAction,
  viewBandsAction: viewBandsAction
}