const {
  Before,
  After,
  BeforeAll,
  AfterAll
} = require('cucumber')
const mongoose = require('mongoose')
const app = require('../../app')
const Band = require('../../lib/models/Band');
const User = require('../../lib/models/User')
const MembershipRequest = require('../../lib/models/MembershipRequest')
const Location = require('../../lib/models/Location')

Before(async function () {
  await User.collection.deleteMany()
  await Band.collection.deleteMany()
  await MembershipRequest.collection.deleteMany()
  await Location.collection.deleteMany()
  this.app = app
})

AfterAll(function() {
  mongoose.connection.close()
})
