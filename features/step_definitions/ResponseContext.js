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

Then('the platform should respond that the request was successful', function (done) {
  let self = this
  this.request.expect(200)
  .end((err, res)=>{
    if (err) throw err
    self.response = res
    done()
  })
});

Then('the response should contain a user ID', function () {
  expect(this.response.body.userId).to.exist
});

Then('the response should confirm my email address', function () {
  expect(this.response.body.user.email).to.exist
});

Then('the response should contain my user ID', function () {
  expect(this.response.body.user.userId).to.exist
});

Then('the response should contain a valid authentication token', function () {
  expect(this.response.body.user.token).to.exist
});

Then('no email, username or authentication token should have been sent', function () {
  expect(this.response.body).to.not.have.property('email')
  expect(this.response.body).to.not.have.property('username')
  expect(this.response.body).to.not.have.property('token')
});

Then('the platform should respond that I am not allowed to do this', function (done) {
  let self = this
  this.request.expect(401)
  .end((err, res)=>{
    if (err) throw err
    self.response = res
    done()
  })
});

Then('the platform should respond showing the infromation was updated', function (done) {
  let self = this
  this.request.expect(204)
    .end((err, res)=>{
      if (err) throw err
      self.response = res
      done()
    })
});
