const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const User = require('../../lib/models/User')
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationObjFromTableColumn
} = require('./helpers/TableConverter.js')

Then('my friendly location should be {string}', async function (friendlyName) {
  const user = await User.findById(this.user.id)
  expect(user.location.friendlyLocation).to.eq(friendlyName)
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
  const user = await User.findById(this.user.id)
  coords.forEach((coord, i)=>{
    expect(user.location.coords[i]).to.eq(parseFloat(coord))
  })
});

Given('I have not set my profile information', function () {
  const properties = ['firstName', 'lastName', 'bio', 'location']
  properties.forEach((prop)=>{
    expect(this.user[prop]).to.eq(undefined)
  })

  expect(this.user.instruments.length).to.eq(0)
});

Given('I have previously set my profile information to:', async function (dataTable) {
  let profile = createObjArrayFromTable(dataTable)
  this.user.instruments = instrumentArrayFromTableColumn(profile.instruments)
  this.user.location = locationObjFromTableColumn(profile.location)
  this.user.firstName = profile.firstName
  this.user.lastName = profile.lastName
  this.user.bio = profile.bio
  await this.user.save()
});

Given('the user {string} has set their profile information to:', async function (email, dataTable) {
  let profile = createObjArrayFromTable(dataTable)
  let user = await User.find({ email: email })
  user = user[0]

  user.instruments = instrumentArrayFromTableColumn(profile.instruments)
  user.location = locationObjFromTableColumn(profile.location)
  user.firstName = profile.firstName
  user.lastName = profile.lastName
  user.bio = profile.bio
  await user.save()
});
