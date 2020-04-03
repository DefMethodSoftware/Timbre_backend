const IncomingUserParamValidator = require('./IncomingUserParamValidator')

it('throws if password is not present', ()=>{
  try {
    IncomingUserParamValidator({
      email: "test@test.com",
      username: 'username',
      password: ''
    })
  } catch (e) {
    expect(e).toBe('Invalid Password')
  }
})

it('throws if password key is not present', ()=>{
  try {
    IncomingUserParamValidator({
      email: "test@test.com",
      username: 'username'
    })
  } catch (e) {
    expect(e).toBe('Invalid Password')
  }
})

it('throws if email is not present', ()=>{
  try {
    IncomingUserParamValidator({
      email: "",
      username: 'username',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Email Address')
  }
})

it('throws if email key is not present', ()=>{
  try {
    IncomingUserParamValidator({
      username: 'username',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Email Address')
  }
})

it('throws if email is invalid', ()=>{
  try {
    IncomingUserParamValidator({
      email: 'test.com',
      username: 'username',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Email Address')
  }
})

it('throws if email is invalid', ()=>{
  try {
    IncomingUserParamValidator({
      email: 'test@testcom',
      username: 'username',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Email Address')
  }
})

it('throws if email key is not present', ()=>{
  try {
    IncomingUserParamValidator({
      username: 'username',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Email Address')
  }
})

it('throws if username is not present', ()=>{
  try {
    IncomingUserParamValidator({
      email: "test@test.com",
      username: '',
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Username')
  }
})

it('throws if username key is not present', ()=>{
  try {
    IncomingUserParamValidator({
      email: "test@test.com",
      password: 'password'
    })
  } catch (e) {
    expect(e).toBe('Invalid Username')
  }
})