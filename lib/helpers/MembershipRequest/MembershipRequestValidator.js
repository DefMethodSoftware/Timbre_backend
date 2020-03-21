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

  return userLoc.distanceTo(bandLoc, true) < 2
}

module.exports = {
  validateNewRequest: validateNewRequest
}
