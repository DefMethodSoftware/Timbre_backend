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

Before(async function (context) {
  this.version = extractVersion(context.pickle.tags)
  await User.collection.deleteMany()
  await Band.collection.deleteMany()
  await MembershipRequest.collection.deleteMany()
  await Location.collection.deleteMany()
  this.app = app
})

AfterAll(function() {
  mongoose.connection.close()
})

const extractVersion = (tags) => {
  let version
  tags.forEach(tag => {
    if (tag.name.includes('version')) {
      // comes in a @version: vx.x format
      version = tag.name.split(" ")[1]
    }
  })
  return version.length > 0 ? version : "v1.0"
}
