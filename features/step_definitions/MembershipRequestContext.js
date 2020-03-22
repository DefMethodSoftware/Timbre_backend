const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const request = require('supertest')
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationObjFromTableColumn,
  missingInstrumentsFromTableColumn
} = require('./helpers/TableConverter.js')
const MembershipRequest = require('../../lib/models/MembershipRequest.js')
const Band = require('../../lib/models/Band.js')
const User = require('../../lib/models/User.js')

Given('I have requested to join the band {string}', async function (bandName) {
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = new MembershipRequest({
    user: this.user.id,
    band: band.id
  })

  await membershipRequest.save()
  band.membershipRequests.unshift(membershipRequest)
  await band.save()
});

Given('the user {string} has requested to join the band {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = new MembershipRequest({
    user: user.id,
    band: band.id
  })

  await membershipRequest.save()
  band.membershipRequests.unshift(membershipRequest)
  await band.save()
});

Given('I have accepted {string}\'s request to join {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ user: user.id, band: band.id })
  membershipRequest.accepted = true
  await membershipRequest.save()
});

Given('I have declined {string}\'s request to join {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ user: user.id, band: band.id })
  membershipRequest.declined = true
  await membershipRequest.save()
});

Then('there should be a membership request in the system for me to join {string}', async function (bandName) {
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ band: band.id }).populate('user')
  expect(membershipRequest.user.id).to.eq(this.user.id)
});

Then('there should be no membership requests in the system', async function () {
  const membershipRequests = await MembershipRequest.find()
  expect(membershipRequests.length).to.eq(0)
});

Then('I should see a request for {string} to join my band {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })

  let expectedRequest
  this.response.body.membershipRequests.forEach((request) => {
    if (request.user === user.id && request.band === band.id) {
      expectedRequest = request
    }
  })

  if (expectedRequest) {
    return
  }

  throw "RequestNotFoundError"
});

Then('I should not see a request for me to join {string}', async function (bandName) {
  const band = await Band.findOne({ bandName: bandName })

  let expectedRequest
  this.response.body.membershipRequests.forEach((request) => {
    if (request.user === this.user.id && request.band === band.id) {
      expectedRequest = request
    }
  })

  if (!expectedRequest) {
    return
  }

  throw "RequestFoundError"
});

Then('I should see an empty list of membership requests', function () {
  expect(this.response.body.membershipRequests.length).to.eq(0)
});

Then('there should be an accepted membership request in the system for {string} to join {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })

  const membershipRequest = await MembershipRequest.findOne({ user: user.id, band: band.id })
  expect(membershipRequest.accepted).to.eq(true)
});

Then('there should be a declined membership request in the system for {string} to join {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })

  const membershipRequest = await MembershipRequest.findOne({ user: user.id, band: band.id })
  expect(membershipRequest.declined).to.eq(true)
});
