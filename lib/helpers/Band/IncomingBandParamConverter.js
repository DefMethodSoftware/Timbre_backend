const convert = (body, user) => {
  if (body.bandName.length < 1) {
    throw "Invalid Band Name"
  }

  if (Object.keys(body.missingInstruments).length < 1) {
    throw "Band has no missing instruments"
  }
  
  if (body.bio.length < 1) {
    throw "Invalid Band bio"
  }
  body.location = {}
  body.location.coordinates = user.location.coords
  body.locationFriendly = user.location.friendlyLocation
  body.user = user.id
  return body
}

module.exports = convert