const EMAIL_REGEX = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)

validate = (profile) => {
  [long, lat] = profile.location.coords 
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
