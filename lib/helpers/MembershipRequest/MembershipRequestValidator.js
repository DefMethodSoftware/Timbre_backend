const GeoPoint = require('geopoint')

const validateNewRequest = (user, band) => {
  return isValidInstrument(user, band) && isValidDistance(user.location.coords, band.location.coordinates)
}

const isValidInstrument = (user, band) => {
  let result = false
  user.instruments.forEach((instrumentObj)=>{
    if(band.missingInstruments[instrumentObj.instrument] > 0) {
      result = true
    }
  })

  return result
}

const isValidDistance = (userCoords, bandCoords) => {
  const userLoc = new GeoPoint(userCoords[0], userCoords[1])
  const bandLoc = new GeoPoint(bandCoords[0], bandCoords[1])

  // 2 km, I figure we'd later store this on the band owner and use it in the get bands endpoint 
  // e.g. .find().where(band.user.distance <= currentUser.distance)
  return userLoc.distanceTo(bandLoc, true) < 2
}

module.exports = {
  validateNewRequest: validateNewRequest
}
