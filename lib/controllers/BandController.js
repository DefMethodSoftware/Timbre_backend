const Band = require('../models/Band');
const User = require('../models/User')
const Location = require('../models/Location')
const createError = require('http-errors');
const MembershipRequest = require('../models/MembershipRequest')
const IncomingBandParamConverter = require('../helpers/Band/IncomingBandParamConverter')

const createBandAction = async (user, body, res, next) => {
  if (!user.hasSetProfile()){
    next(createError(400, "User Profile Not Set"))
    return
  }

  try {
    var incomingBand = IncomingBandParamConverter(body, user)
  } catch (e) {
    next(createError(400, e))
    return
  }

  const band = new Band(incomingBand)
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

  await User.populate(user, 'location')

  // create a list of instruments the user plays, to compare against the available positions
  // in the band
  let userInstruments = user.getInstruments().map((instrument)=>{
    return { [`missingInstruments.${instrument.instrument}`]: { $exists : true } }
  })

  // create a list of Membership Requests the user has created to ensure those bands are left
  // out of the results
  let memberships = await MembershipRequest.find({user_id: user.id}, {band_id: 1, _id: 0})
        .select('_id')

  // we can't query band locations directly, so we create a list of Locations that are
  // within the correct distance of the user
  let matchedLocations = await Location.find()
        .and({
          _geoJSON: {
            $near: {
              $geometry: user.getLocation().getGeoJSON(),
              $maxDistance: 2000
            },
          }
        })
      .select('_id')

  let bands = await Band.find()
     // or because it could be any of the instruments
      .or(userInstruments)
     // the Band Location is in the list of Locations near the user
      .and({
	location: {$in: matchedLocations}
      })
     // the user hasn't requested to join this band already
      .and ({
        _id:{ $nin: memberships }
      })

  return res.status(200).send({ bands: bands })
}

module.exports = {
  createBandAction: createBandAction,
  viewBandsAction: viewBandsAction
}
