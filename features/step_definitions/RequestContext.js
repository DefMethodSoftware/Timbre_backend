const { Given, When, Then } = require('cucumber');
const request = require('supertest')
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationFromTableColumn,
  missingInstrumentsFromTableColumn,
  locationParamsFromTableColumn
} = require('./helpers/TableConverter.js')
const Band = require('../../lib/models/Band.js')
const User = require('../../lib/models/User.js')
const MembershipRequest = require('../../lib/models/MembershipRequest.js')


When('I send a request to create the following user:',  function (userDetails) {
  userDetails = createObjArrayFromTable(userDetails)
  this.request = request(this.app)
  .post('/users')
  .set('Content-Type', 'application/json')
  .send(userDetails)
});

When('I send a request to log in with {string} and {string}', function (email, password) {
  let body = {
    email: email,
    password: password
  }
  this.request = request(this.app)
  .post('/users/login')
  .set('Content-Type', 'application/json')
  .send(body)
});

When('I send a request to set the following profile information:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationParamsFromTableColumn(body.location)

  this.request = request(this.app)
    .patch(`/users/${this.user.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send(body)
});

When('I send an unauthenticated request to set the following profile information:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationFromTableColumn(body.location)

  this.request = request(this.app)
    .patch(`/users/${this.anotherUser.id}`)
    .set('Content-Type', 'application/json')
    .send(body)
});

When('I send a request to set the following profile information for {string}:', async function (email, dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationFromTableColumn(body.location)
  const otherUser = await User.findOne({ email: email })

  this.request = request(this.app)
    .patch(`/users/${otherUser.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send(body)
});

When('I send a request to set the following profile information for a non-existant user:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationFromTableColumn(body.location)

  this.request = request(this.app)
    .patch('/users/12345678')
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send(body)
});

When('I send a request to create the following band:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.missingInstruments = missingInstrumentsFromTableColumn(body.missingInstruments)

  this.request = request(this.app)
    .post('/bands')
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send(body)
});

When('I send an unauthenticated request to create the following band:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.missingInstruments = missingInstrumentsFromTableColumn(body.missingInstruments)

  this.request = request(this.app)
    .post('/bands')
    .set('Content-Type', 'application/json')
    .send(body)
});

When('I request to see bands in my area', function () {
  this.request = request(this.app)
    .get('/bands')
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send()
});

When('I send an unauthenticated request to see a list of bands', function () {
  this.request = request(this.app)
    .get('/bands')
    .set('Content-Type', 'application/json')
    .send()
});

When('I send a request to join {string}', async function (bandName) {
  let band = await Band.findOne({ bandName: bandName })
  this.request = request(this.app)
    .post(`/bands/${band.id}/membership_requests`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send()
});

When('I send an unauthenticated request to join {string}', async function (bandName) {
    let band = await Band.findOne({ bandName: bandName })
  this.request = request(this.app)
    .post(`/bands/${band.id}/membership_requests`)
    .set('Content-Type', 'application/json')
    .send()
});

When('I send a request to join a non-existant Band', function () {
    this.request = request(this.app)
    .post(`/bands/12345678/membership_requests`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send()
});

When('I request to see a list of membership requests', function () {
  this.request = request(this.app)
    .get('/membership_requests')
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send()
});

When('I send an unauthenticated request to see a list of membership requests', function () {
  this.request = request(this.app)
    .get('/membership_requests')
    .set('Content-Type', 'application/json')
    .send()
});

When('I send a request to accept {string}\'s request to join the band {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ band: band.id, user: user.id })

  this.request = request(this.app)
    .patch(`/bands/${band.id}/membership_requests/${membershipRequest.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send({
      accepted: true
    })
});

When('I send a request to decline {string}\'s request to join the band {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ band: band.id, user: user.id })

  this.request = request(this.app)
    .patch(`/bands/${band.id}/membership_requests/${membershipRequest.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send({
      declined: true
    })
});

When('I send a request to accept some rubbish membership request', function () {
  this.request = request(this.app)
    .patch(`/bands/12345678/membership_requests/12345678`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send({
      accepted: true
    })
});

When('I send an unauthenticated request to accept {string}\'s requests to join the band {string}', async function (email, bandName) {
  const user = await User.findOne({ email: email })
  const band = await Band.findOne({ bandName: bandName })
  const membershipRequest = await MembershipRequest.findOne({ band: band.id, user: user.id })

  this.request = request(this.app)
    .patch(`/bands/${band.id}/membership_requests/${membershipRequest.id}`)
    .set('Content-Type', 'application/json')
    .send({
      approved: true
    })
});
