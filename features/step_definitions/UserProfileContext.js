const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect
const User = require('../../lib/models/User')

Then('my friendly location should be {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('my profile information should not be set', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('I should play {string} at level {int}', function (string, int) {
  // Then('I should play {string} at level {float}', function (string, float) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('I should have the first name {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('I should have the last name {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('I should have the bio {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('my location coordinates should be {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('I have not set my profile information', function () {
  const properties = ['firstName', 'lastName', 'bio', 'location']
  properties.forEach((prop)=>{
    expect(this.user[prop]).to.eq(undefined)
  })

  expect(this.user.instruments.length).to.eq(0)
});
