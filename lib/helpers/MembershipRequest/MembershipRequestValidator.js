const GeoPoint = require('geopoint')

const validateNewRequest = (user, band) => {
  isValidInstrument(user, band)
  isValidDistance(user.location.coords, band.location.coordinates)
}

const isValidInstrument = (user, band) => {
  let valid = false
  user.instruments.forEach((instrumentObj)=>{
    if(band.missingInstruments[instrumentObj.instrument] > 0) {
      valid = true
    }
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

module.exports = validateNewRequest
