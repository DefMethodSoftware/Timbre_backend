const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect

Then('the platform should respond that the creation was successful', function (done) {
  let self = this
  this.request.expect(201)
  .end((err, res)=>{
    if (err) throw err
    self.response = res
    done()
  })
});

Then('the response should contain an authentication token', function () {
  expect(this.response.body).to.have.property('token')
});


Then('the platform should respond that the email address is taken',  function (done) {
  let self = this
  this.request.expect(400)
  .end((err, res)=>{
    if (err) throw err
    self.response = res
    done()
  })
});

Then('the platform should respond that the request was bad',  function (done) {
  let self = this
  this.request.expect(400)
  .end((err, res)=>{
    if (err) throw err
    self.response = res
    done()
  })
});

Then('the platform should respond that the request was successful', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should contain a user ID', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should confirm my email address', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should contain my user ID', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should contain a valid authentication token', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should not contain a valid authentication token', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the response should not contain my user ID', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
})

Then('the response should not confirm my email address', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});


Then('no email, username or authentication token should have been sent', function () {
  expect(this.response.body).to.not.have.property('email')
  expect(this.response.body).to.not.have.property('username')
  expect(this.response.body).to.not.have.property('token')
});

