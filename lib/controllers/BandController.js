const Band = require('../models/Band');
const User = require('../models/User')
const MembershipRequest = require('../models/MembershipRequest')

const createBandAction = async (user, body, res) => {
  try {
      var params = bandParamsFromReqBody(body, user)
    } catch (e) {
      return res.status(400).json("User profile incomplete")
    }
    let band = new Band(params)
    user.bands.push(band)
    await band.save() 
    await user.save()
    return res.status(201).json("Band created successfully")
}

const viewBandsAction = async (user, res) => {
  if (!user.location){
	      return res.status(400).json("User Profile Not Set")
      }
      let userInstruments = []
      user.instruments.map((instrument)=>{
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
                                    coordinates: user.location.coords
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

const bandParamsFromReqBody = (body, user) => {
  body.location = {}
  body.location.coordinates = user.location.coords
  body.locationFriendly = user.location.friendlyLocation
  body.user = user.id
  return body
}

module.exports = {
  createBandAction: createBandAction,
  viewBandsAction: viewBandsAction
}