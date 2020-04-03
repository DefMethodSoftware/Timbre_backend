const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationFromTableColumn,
  missingInstrumentsFromTableColumn
} = require('./helpers/TableConverter.js')
const Band = require("../../lib/models/Band.js")
const User = require("../../lib/models/User.js")

Given('I have previously created the following band:', async function (dataTable) {
  let bandParams = createObjArrayFromTable(dataTable)
  bandParams.missingInstruments = missingInstrumentsFromTableColumn(bandParams.missingInstruments)
  bandParams.location = this.user.getLocation()
  bandParams.user = this.user
  const band = new Band(bandParams)
  await band.save()
  this.user.bands.push(band)
  await this.user.save()
});

Given('the user {string} has created the following band:', async function (email, dataTable) {
  let user = await User.find({ email: email })
  user = user[0]
  let bandParams = createObjArrayFromTable(dataTable)

  bandParams.missingInstruments = missingInstrumentsFromTableColumn(bandParams.missingInstruments)
  bandParams.location = user.getLocation()
  bandParams.user = user
  const band = new Band(bandParams)
  await band.save()
  user.bands.push(band)
  await user.save()
});

Given('there are no bands associated with my account', function () {
  expect(this.user.bands.length).to.eq(0)
});

Then('there should be a band associated with my account with the following information:', async function (dataTable) {
  let expectedBand = createObjArrayFromTable(dataTable)
  expectedBand.missingInstruments = missingInstrumentsFromTableColumn(expectedBand.missingInstruments)

  this.user = await User.findById(this.user.id)
    .populate('bands')
  expect(this.user.getBands().length).to.eq(1)

  let band = this.user.getBands()[0]

  expect(band.getLocation().equals(this.user.getLocation())).to.eq(true)
  expect(band.getBandName()).to.eq(expectedBand.bandName)
  expect(band.getBio()).to.eq(expectedBand.bio)
});

Then('there should be no bands in the system', async function () {
  let bands = await Band.find({})
  expect(bands.length).to.eq(0)
});

Then('there should be two bands associated with my account', async function () {
  this.user = await User.findById(this.user.id)
    .populate('bands')
  expect(this.user.bands.length).to.eq(2)
});

Then('there should be no bands associated with my account', async function () {
    this.user = await User.findById(this.user.id)
    .populate('bands')
  expect(this.user.bands.length).to.eq(0)
});

Then('I should see the band {string}', function (bandName) {
  const bands = this.response.body.bands
  for (let i = 0; i < bands.length; i++) {
    if(bands[i].bandName === bandName) {
      return
    }
  }

  throw `didn't find ${bandName}`
});

Then('I should not see the band {string}', function (bandName) {
  const bands = this.response.body.bands
  for (let i = 0; i < bands.length; i++) {
    if(bands[i].bandName === bandName) {
      throw `Found ${bandName} but shouldn't have`
    }
  }
});

const compareLocation = (expected, actual) => {
  return expected[0] === actual[0] && expected[1] === actual[1]
}
