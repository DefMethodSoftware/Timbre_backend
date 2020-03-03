const { Given, When, Then } = require('cucumber');
const expect = require('chai').expect

Then('the platform should respond that the user was created successfully', function (done) {
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

Then('the platform should respond that an email is required',  () => {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the platform should respond that a username is required',  () => {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the platform should respond that a password is required',  () => {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('no email, username or authentication token should have been sent', function () {
  expect(this.response.body).to.not.have.property('email')
  expect(this.response.body).to.not.have.property('username')
  expect(this.response.body).to.not.have.property('token')
});

