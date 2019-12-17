const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const User = require('../models/User')
let db
before(function (done) {
  mongoose.connect('mongodb://127.0.0.1:27017/timbre_test');
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function() {
    console.log('We are connected to test database!');
    done();
  });
});


describe('User', function() {
  beforeEach(function(done) {
    db.dropDatabase()
    done()
    this.user = new User({email: 'test@test.com', password: 'testpassword'})
  })
  
  describe('toAuthJSON', function() {
    it('returns a JSON of the user and JWT token', function() {
      this.user.generateJWT = sinon.fake.returns('JWT')
      expect(this.user.toAuthJSON()).to.eql({ email: 'test@test.com', token: 'JWT' })
    })
  })
})