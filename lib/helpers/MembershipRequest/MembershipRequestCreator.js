const GeoPoint = require('geopoint')
const MembershipRequest = require('../../models/MembershipRequest');

const create = async (user, band) => {
  hasValidInstrument(user, band)
  isValidDistance(user.getLocation().getGeoJSON().coordinates,
		  band.getLocation().getGeoJSON().coordinates)
  let membershipRequest = new MembershipRequest({
            user: user.getId(),
            band: band.getId()
          })
  await membershipRequest.save()
  band.addMembershipRequest(membershipRequest)
  await band.save()
}

const hasValidInstrument = (user, band) => {
  if (!band.hasMissingInstrumentForUser(user)) {
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
