const convert = (body, user) => {
  if (body.bandName === undefined || body.bandName.length < 1) {
    throw "Invalid Band Name"
  }

  if (body.missingInstruments === undefined || Object.keys(body.missingInstruments).length < 1) {
    throw "Band has no missing instruments"
  }
  
  if (body.bio === undefined || body.bio.length < 1) {
    throw "Invalid Band bio"
  }

  body.location = {}
  body.location.coordinates = user.getLocation().coords
  body.locationFriendly = user.getLocation().friendlyLocation
  body.user = user.id
  return body
}

module.exports = convert