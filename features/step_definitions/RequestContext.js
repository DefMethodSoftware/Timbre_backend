const { Given, When, Then } = require('cucumber');
const request = require('supertest');

When('I send a request to create a new user with the following information:',  function (userDetails) {
  userDetails = createObjArrayFromTable(userDetails)
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
  }, [])
}