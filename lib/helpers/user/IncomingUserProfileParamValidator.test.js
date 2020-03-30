const IncomingUserProfileParamValidator = require('./IncomingUserProfileParamValidator')

it('throws if user location coordinates are off the planet', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 200, -1000 ],
      locationFriendly: "Mars"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Bad Location coordinates')
})

it('throws if user doesnt include a location key', ()=>{
  const incomingProfile = {
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid: location not included in profile')
})

it('throws if user doesnt include an instrument', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [],
    firstName: 'Test',
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('User must play an instrument')
})

it('throws if user doesnt include an instruments key', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    firstName: 'Test',
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid: instruments not included in profile')
})

it('throws if user doesnt include a first name', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: '',
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid User Name')
})

it('throws if user doesnt include a first name key', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    lastName: 'User'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid: firstName not included in profile')
})

it('throws if user doesnt include a last name', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test',
    lastName: ''
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid User Name')
})

it('throws if user doesnt include a last name key', ()=>{
  const incomingProfile = {
    location: {
      coords: [ 90, 45 ],
      locationFriendly: "The Ocean"
    },
    instruments: [ { instrument: 'drums', rating: 5 } ],
    firstName: 'Test'
  }

  expect(()=>{
    IncomingUserProfileParamValidator(incomingProfile)
  }).toThrow('Invalid: lastName not included in profile')
})