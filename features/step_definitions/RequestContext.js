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
  let body = createObjArrayFromTable(dataTable)
  body.instruments = instrumentArrayFromTableColumn(body.instruments)
  body.location = locationObjFromTableColumn(body.location)
  console.log(body.location)
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

const instrumentArrayFromTableColumn = (col) => {
  return col.split(',').reduce((result, instrument) => {
    instrument = instrument.split(': ')
    result[instrument[0]] = instrument[1]
    return result
  }, {})
}

const locationObjFromTableColumn = (col) => {
  let location = {}
  let params = col.split(', ').map((param)=>{
    return param.split(': ')
  })
  location.friendlyLocation = params[0][1]
  location.coords = [params[1][1], params[2][1]]
  location.coords = location.coords.map(x=>Number.parseFloat(x))
  return location
  
}


