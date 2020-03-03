const { 
  Before,
  After,
  BeforeAll,
  AfterAll 
} = require('cucumber')
const mongoose = require('mongoose')
const app = require('../../app')

// BeforeAll(function(callback) {
// })

Before(async function () {  
  await mongoose.connection.dropDatabase()
  this.app = app
})

After(function() {
})

AfterAll(function() {
})