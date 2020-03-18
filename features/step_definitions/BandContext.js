const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationObjFromTableColumn,
  missingInstrumentsFromTableColumn
} = require('./helpers/TableConverter.js')
const Band = require("../../lib/models/Band.js")
const User = require("../../lib/models/User.js")

Given('I have previously created the following band:', async function (dataTable) {
  let bandParams = createObjArrayFromTable(dataTable)
  bandParams.missingInstruments = missingInstrumentsFromTableColumn(bandParams.missingInstruments)
  bandParams.location = this.user.location.coords
  bandParams.locationFriendly = this.user.location.friendlyLocation
  bandParams.user = this.user.id
  const band = new Band(bandParams)
  await band.save()
  this.user.bands.push(band)
  await this.user.save()
});

Then('there should be a band associated with my account with the following information:', async function (dataTable) {
  let expectedBand = createObjArrayFromTable(dataTable)
  expectedBand.missingInstruments = missingInstrumentsFromTableColumn(expectedBand.missingInstruments)
  expectedBand.location = this.user.location.coords
  expectedBand.locationFriendly = this.user.location.friendlyLocation

  this.user = await User.findById(this.user.id)
    .populate('bands')
  expect(this.user.bands.length).to.eq(1)

  let band = this.user.bands[0]
  expect(compareLocation(expectedBand.location, band.location)).to.eq(true)
  expect(band.locationFriendly).to.eq(expectedBand.locationFriendly)
  expect(band.name).to.eq(expectedBand.name)
  expect(band.bio).to.eq(expectedBand.bio)
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

const compareLocation = (expected, actual) => {
  return expected[0] === actual[0] && expected[1] === actual[1]
}
