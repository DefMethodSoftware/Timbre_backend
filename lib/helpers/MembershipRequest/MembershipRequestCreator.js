const GeoPoint = require('geopoint')
const MembershipRequest = require('../../models/MembershipRequest');

const create = async (user, band) => {
  isValidInstrument(user, band)
  isValidDistance(user.location.coords, band.location.coordinates)
  let membershipRequest = new MembershipRequest({
            user: user.id,
            band: band.id
          })
  band.membershipRequests.push(membershipRequest)
  await membershipRequest.save()
  await band.save()
}

const isValidInstrument = (user, band) => {
  let valid = user.instruments.some((instrumentObj)=>{
    return band.missingInstruments[instrumentObj.instrument] > 0
  })
  if (!valid) {
    throw 'No open position for user in band'
  }
}

const isValidDistance = (userCoords, bandCoords) => {
  const userLoc = new GeoPoint(userCoords[0], userCoords[1])
  const bandLoc = new GeoPoint(bandCoords[0], bandCoords[1])

  // 2 km, I figure we'd later store this on the band owner and use it in the get bands endpoint 
  // e.g. .find().where(band.user.distance <= currentUser.distance)
  if (userLoc.distanceTo(bandLoc, true) > 2) {
    throw 'User is too far away from band'
  }
}

module.exports = create