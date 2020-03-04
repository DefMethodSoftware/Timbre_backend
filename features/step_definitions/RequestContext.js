const { Given, When, Then } = require('cucumber');
const request = require('supertest')

When('I send a request to create the following user:',  function (userDetails) {
  userDetails = createObjArrayFromTable(userDetails)
  this.request = request(this.app)
  .post('/users')
  .set('Content-Type', 'application/json')
  .send(userDetails)
}); 

When('I send a request to log in with {string} and {string}', function (email, password) {
  body = {
    email: email,
    password: password
  }
  this.request = request(this.app)
  .post('/users/login')
  .set('Content-Type', 'application/json')
  .send(body)
});

When('I send a request to set the following profile information:', function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

// Helpers
const createObjArrayFromTable = (table) => {
  table = table.raw()
  return table.slice(1).reduce((result, val )=>{
    result.push(table[0].reduce((obj, key, index)=>{
      obj[key] = val[index]
      return obj
    }, {}))
    return result
  }, [])[0]
}
