const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const User = require('../../lib/models/User')

Given('there is a user in the system with the email {string} and username {string}', async (email, username) => {
  this.user = new User({email: email, username: username, password: 'password'})
  await this.user.save()
});

Then('there should be a user in the system with the email {string} and username {string}',  async (email, username) => {
  this.user = await User.findOne({email: email})
  expect(this.user.email).to.eq(email)
  expect(this.user.username).to.eq(username)
});

Given('I am logged in as a user', async function () {
  this.user = new User({email: "testuser@user.com", username: 'testuser', password: 'password'})
  await this.user.save()
});

Given('I am not logged in', async function () {
  this.anotherUser = new User({email: "testuser@user.com", username: 'testuser', password: 'password'})
  await this.anotherUser.save()
});

