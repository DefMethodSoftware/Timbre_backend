const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const User = require('../../lib/models/User')
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationFromTableColumn
} = require('./helpers/TableConverter.js')

Then('my friendly location should be {string}', async function (friendlyName) {
  const user = await User.findById(this.user.id).populate('location')
  expect(user.getLocation().getName()).to.eq(friendlyName)
});

Then('my profile information should not be set', function () {
  expect(this.user.firstName).to.eq(undefined)
  expect(this.user.lastName).to.eq(undefined)
  expect(this.user.bio).to.eq(undefined)
  expect(this.user.instruments.length).to.eq(0)
  expect(this.user.location).to.eq(undefined)
});

Then('I should play {string} at level {int}', async function (instrument, level) {
  const user = await User.findById(this.user.id)
  user.instruments.forEach((instObj) => {
    if(instObj.instrument === instrument) {
      expect(instObj.rating).to.eq(level)
    }
  })
});

Then('I should have the first name {string}', async function (firstName) {
  const user = await User.findById(this.user.id)
  expect(user.firstName).to.eq(firstName)
});

Then('I should have the last name {string}', async function (lastName) {
  const user = await User.findById(this.user.id)
  expect(user.lastName).to.eq(lastName)
});

Then('I should have the bio {string}', async function (bio) {
  const user = await User.findById(this.user.id)
  expect(user.bio).to.eq(bio)
});

Then('my location coordinates should be {string}', async function (coords) {
  coords = coords.split(', ')
  const user = await User.findById(this.user.id).populate('location')
  expect(user.getLocation().getLongitude()).to.eq(parseFloat(coords[0]))
  expect(user.getLocation().getLatitude()).to.eq(parseFloat(coords[1]))
});

Given('I have not set my profile information', function () {
  const properties = ['firstName', 'lastName', 'bio', 'location']
  properties.forEach((prop)=>{
    expect(this.user[prop]).to.eq(undefined)
  })

  expect(this.user.instruments.length).to.eq(0)
});

Given('I have previously set my profile information to:', async function (dataTable) {
  const profile = createObjArrayFromTable(dataTable)

  const location = await locationFromTableColumn(profile.location)
  profile.instruments = instrumentArrayFromTableColumn(profile.instruments)
  this.user.setProfile(profile, location)
  await this.user.save()
});

Given('the user {string} has set their profile information to:', async function (email, dataTable) {
  const profile = createObjArrayFromTable(dataTable)
  const user = await User.findOne({ email: email })

  const location = await locationFromTableColumn(profile.location)
  profile.instruments = instrumentArrayFromTableColumn(profile.instruments)
  user.setProfile(profile, location)
  await user.save()
});
