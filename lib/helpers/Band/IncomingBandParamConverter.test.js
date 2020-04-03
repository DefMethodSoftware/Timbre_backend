const IncomingBandParamConverter = require('./IncomingBandParamConverter')
const User = require('../../models/User')
const Location = require('../../models/Location')

jest.mock('../../models/User')
jest.mock('../../models/Location')

it('returns an object of band properties', ()=>{
  const location = new Location()
  const user = new User()
  user.getLocation.mockReturnValue(location)
  const body = {
    bandName: 'bandName',
    missingInstruments: { instrument: 'instrument', count: 1 },
    bio: 'band bio'
  }

  result = IncomingBandParamConverter(body, user)
  expect(result.bandName).toBe('bandName')
  expect(result.missingInstruments).toBe(body.missingInstruments)
  expect(result.bio).toBe('band bio')
  expect(result.location).toBe(location)
})

it('throws if there is no band name', ()=>{
  const user = new User()
  const body = {
    bandName: '',
    missingInstruments: { instrument: 'instrument', count: 1 },
    bio: 'band bio'
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Invalid Band Name')
  }
})

it('throws if there is no bandName key', ()=>{
  const user = new User()
  const body = {
    missingInstruments: { instrument: 'instrument', count: 1 },
    bio: 'band bio'
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Invalid Band Name')
  }
})

it('throws if there are no missing instruments', ()=>{
  const user = new User()
  const body = {
    bandName: 'bandName',
    missingInstruments: {},
    bio: 'band bio'
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Band has no missing instruments')
  }
})

it('throws if there is no missing instruments key', ()=>{
  const user = new User()
  const body = {
    bandName: 'bandName',
    bio: 'band bio'
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Band has no missing instruments')
  }
})

it('throws if there is no bio', ()=>{
  const user = new User()
  const body = {
    bandName: 'bandName',
    missingInstruments: { instrument: 'instrument', count: 1 },
    bio: ''
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Invalid Band bio')
  }
})

it('throws if there is no bio key', ()=>{
  const user = new User()
  const body = {
    bandName: 'bandName',
    missingInstruments: { instrument: 'instrument', count: 1 }
  }
  try {
    IncomingBandParamConverter(body, user)
  } catch (e) {
    expect(e).toBe('Invalid Band bio')
  }
})
