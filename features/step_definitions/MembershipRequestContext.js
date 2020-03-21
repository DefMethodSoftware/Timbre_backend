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

Then('there should be a membership request in the system for me to join {string}', async function (bandName) {
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ band: band.id }).populate('user')
  expect(membershipRequest.user.id).to.eq(this.user.id)
});

Then('there should be no membership requests in the system', async function () {
  const membershipRequests = await MembershipRequest.find()
  expect(membershipRequests.length).to.eq(0)
});


