const Location = require('../../models/Location')

const REQUIRED_PROFILE_KEYS = ['location', 'instruments', 'firstName', 'lastName']
const ALLOWED_INSTRUMENTS = ['guitar', 'bass', 'drums', 'piano', 'vocals']

const convert = async (body) => {
  REQUIRED_PROFILE_KEYS.forEach((key) => {
    if(body[key] === undefined) {
      throw `Invalid: ${key} not included in profile`
    }
  })
  
  let [long, lat] = body.location.coords
  if (long >= 180 ||
      long <= -180 ||
      lat >= 90 ||
      lat <= -90) {
    throw 'Bad Location coordinates'
  }

  if (body.instruments.length < 1) {
    throw "User must play an instrument"
  }
  body.instruments.forEach((instrument)=>{
    if (!ALLOWED_INSTRUMENTS.includes(instrument.instrument)) {
      throw `Sorry the instrument ${instrument} is not supported`
    }
  })

  if (body.firstName.length < 1 || body.lastName.length < 1) {
    throw "Invalid User Name"
  }

  if (body.bio.length < 1) {
    throw "Invalid User Bio"
  }
  const location = await createLocation(body)
  const profile = createProfile(body)
  return [profile, location]
}

const createLocation = async (body) => {
  const location = new Location({
    _geoJSON: {
      type: 'Point',
      coordinates: body.location.coords
    },
    _name: body.location.friendlyLocation
  })
  await location.save()
  return location
}

const createProfile = (body) => {
  return {
    instruments: body.instruments,
    bio: body.bio,
    firstName: body.firstName,
    lastName: body.lastName
  }
}

module.exports = convert
