const { Given, When, Then } = require('cucumber');
const request = require('supertest')
const {
  createObjArrayFromTable,
  instrumentArrayFromTableColumn,
  locationObjFromTableColumn
} = require('./helpers/TableConverter.js')

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
  body.location = locationObjFromTableColumn(body.location)

  this.request = request(this.app)
    .patch(`/users/${this.user.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', this.user.generateJWT())
    .send(body)
});

When('I send an unauthenticated request to set the following profile information:', function (dataTable) {
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationObjFromTableColumn(body.location)

  this.request = request(this.app)
    .patch(`/users/${this.anotherUser.id}`)
    .set('Content-Type', 'application/json')
    .send(body)
});
