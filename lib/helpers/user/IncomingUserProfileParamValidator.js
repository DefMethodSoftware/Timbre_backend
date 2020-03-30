const REQUIRED_KEYS = ['location', 'instruments', 'firstName', 'lastName']

validate = (profile) => {

  REQUIRED_KEYS.forEach((key) => {
    if(profile[key] === undefined) {
      throw `Invalid: ${key} not included in profile`
    }
  })

  let [long, lat] = profile.location.coords 
  if (long >= 180 ||
      long <= -180 ||
      lat >= 90 ||
      lat <= -90) {
    throw 'Bad Location coordinates'
  }

  if (Object.keys(profile.instruments).length < 1) {
    throw "User must play an instrument"
  }

  if (profile.firstName.length < 1 || profile.lastName.length < 1) {
    throw "Invalid User Name"
  }

  if (profile.bio.length < 1) {
    throw "Invalid User Bio"
  }
}

module.exports = validate
