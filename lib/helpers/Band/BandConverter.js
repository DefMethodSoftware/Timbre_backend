const Band = require('../../models/Band')

const convert = async (bandId) => {
  try {
    const band = await Band.findById(bandId).populate('location')
    return band
  } catch (e) {
    throw 'Invalid Band ID'
  }
}

module.exports = convert
