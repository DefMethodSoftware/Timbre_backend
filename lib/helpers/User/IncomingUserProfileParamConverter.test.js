const IncomingUserProfileParamConverter = require('./IncomingUserProfileParamConverter')
const Location = require('../../models/Location')

jest.mock('../../models/Location')

it('returns a profile object and a location', async ()=>{
  let locationParams
  const location = new Location()
  Location.mockImplementation((params)=>{
    locationParams = params
    return location
  })

  const incomingProfile = {
    location: {
      coords: [ 90, -45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: 'User',
    bio: 'User bio'
  }

  let [profile, userLocation] = await IncomingUserProfileParamConverter(incomingProfile)

  expect(userLocation).toBe(location)
  expect(locationParams._geoJSON.type).toBe('Point')
  expect(locationParams._geoJSON.coordinates).toBe(incomingProfile.location.coords)
  Object.keys(profile).forEach((key)=>{
    expect(profile[key]).toBe(incomingProfile[key])
  })
})

it('throws if user location coordinates are off the planet', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 200, -1000 ],
      locationFriendly: "Mars"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: 'User'
  }
  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Bad Location coordinates')
  }
})

it('throws if user doesnt include a location key', async ()=>{
  const incomingProfile = {
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: 'User'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Invalid: location not included in profile')
  }
})

it('throws if user doesnt include an instrument', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [],
    firstName: 'Test',
    lastName: 'User'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('User must play an instrument')
  }
})

it('throws if user doesnt include an instruments key', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    firstName: 'Test',
    lastName: 'User'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Invalid: instruments not included in profile')
  }
})

it('throws if user doesnt include a first name', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: '',
    lastName: 'User'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Invalid User Name')
  }
})

it('throws if user doesnt include a first name key', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    lastName: 'User'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
    
  } catch(e) {
    expect(e).toBe('Invalid: firstName not included in profile')
  }
})

it('throws if user doesnt include a last name', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: ''
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Invalid User Name')
  }
})

it('throws if user doesnt include a last name key', async ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test'
  }

  try {
    await IncomingUserProfileParamConverter(incomingProfile)
  } catch (e) {
    expect(e).toBe('Invalid: lastName not included in profile')
  }
})
