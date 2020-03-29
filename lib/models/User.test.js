const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./User')
const Band = require('./Band')

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('./Band')

beforeEach(()=>{
  this.user = new User({username: 'username', email: 'email', password: 'password', bands: [Band]})
})

it('should be created with a username, email and password', () => {
  const user = new User({username: 'username', email: 'email', password: 'password'})

  expect(user).toBeInstanceOf(User)
  expect(user.username).toBe('username')
  expect(user.email).toBe('email')
})

describe('#validPassword', () => {
  it('should return true for a correct password', ()=>{
    bcrypt.compare.mockReturnValue(true)

    expect(this.user.validPassword('password')).toBeTruthy()
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'password')
  })

  it('should return false for incorrect password', ()=>{
    bcrypt.compare.mockReturnValue(false)

    expect(this.user.validPassword('incorrect')).toBeTruthy()
    expect(bcrypt.compare).toHaveBeenCalledWith('incorrect', 'password')
  })
})

describe('#generateJWT', ()=>{
  it('should call the JWT module', () =>{
    this.user.generateJWT()

    expect(jwt.sign).toHaveBeenCalled()
  })
})

describe('#toAuthJSON', ()=>{
  it('should return an object with the user properties', () => {
    jwt.sign.mockReturnValue('token')

    expect(this.user.toAuthJSON().email).toBe('email')
    expect(this.user.toAuthJSON().userId).toBe(this.user.id)
    expect(this.user.toAuthJSON().token).toBe('token')
  })
})

describe('#setProfile', ()=>{
  it('should set the user properties for each given value', ()=>{
    profile = {
      firstName: 'firstName',
      lastName: 'lastName',
      bio: 'bio',
      instruments: 'instruments'
    }
    this.user.setProfile(profile)

    for (let [prop, value] of Object.entries(profile)) {
      if (value === 'instruments') {
        expect(this.user.instruments[0]).toBe('instruments')
      } else {
        expect(this.user[prop]).toBe(value)
      }
    }
  })
})

describe('#ownsBand', ()=>{
  it('should return true if band is present', ()=>{
    expect(this.user.ownsBand('band')).toBe(true)
  })
})