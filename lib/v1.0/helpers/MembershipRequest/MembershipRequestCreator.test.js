const MembershipRequestCreator = require('./MembershipRequestCreator')
const MembershipRequest = require('../../models/MembershipRequest');
const Band = require('../../models/Band');
const User = require('../../models/User');
const Location = require('../../models/Location');

jest.mock('geopoint')
jest.mock('../../models/MembershipRequest')
jest.mock('../../models/Band')
jest.mock('../../models/User')
jest.mock('../../models/Location')

beforeEach(()=>{
  jest.resetAllMocks()
})

it('creates a Membership Request', async ()=>{
  const user = new User()
  const userLocation = new Location()
  user.getLocation.mockReturnValue(userLocation)
  user.getId.mockReturnValue('12345')
  userLocation.getDistanceTo.mockReturnValue(1)

  const band = new Band()
  const bandLocation = new Location()
  band.getLocation.mockReturnValue(bandLocation)
  band.getId.mockReturnValue('67890')
  band.hasMissingInstrumentForUser.mockReturnValue(true)

  const membershipRequest = new MembershipRequest()
  // we use this to store the params new MembershipRequest was called with so we can
  // check they are right
  let membershipRequestParams
  MembershipRequest.mockImplementation((params)=>{
    // here is where it is set
    membershipRequestParams = params
    return membershipRequest
  })

  await MembershipRequestCreator(user, band)

  expect(band.hasMissingInstrumentForUser).toBeCalledWith(user)
  expect(user.getLocation).toBeCalled()
  expect(band.getLocation).toBeCalled()
  expect(userLocation.getDistanceTo).toBeCalledWith(bandLocation)
  expect(membershipRequestParams.user).toBe(user.getId())
  expect(membershipRequestParams.band).toBe(band.getId())
  expect(membershipRequest.save).toBeCalledTimes(1)
  expect(band.addMembershipRequest).toBeCalledWith(membershipRequest)
  expect(band.save).toBeCalledTimes(1)
})

it('throws if there is no position available in the band for the user', async ()=>{
  const user = new User()

  const band = new Band()
  band.hasMissingInstrumentForUser.mockReturnValue(false)

  try {
    await MembershipRequestCreator(user, band)
  } catch (e) {
    expect(e).toBe('No open position for user in band')
  }

  expect(band.hasMissingInstrumentForUser).toBeCalledWith(user)
  expect(MembershipRequest).not.toBeCalled()
  expect(band.addMembershipRequest).not.toBeCalled()
  expect(band.save).not.toBeCalled()
})


it('Throws if the user is too far away from the band', async ()=>{
  const user = new User()
  const userLocation = new Location()
  user.getLocation.mockReturnValue(userLocation)

  const band = new Band()
  const bandLocation = new Location()
  band.getLocation.mockReturnValue(bandLocation)
  band.hasMissingInstrumentForUser.mockReturnValue(true)

  userLocation.getDistanceTo.mockReturnValue(3)

  try {
    await MembershipRequestCreator(user, band)
  } catch(e) {
    expect(e).toBe('User is too far away from band')
  }

  expect(band.hasMissingInstrumentForUser).toBeCalledWith(user)
  expect(userLocation.getDistanceTo).toBeCalledWith(bandLocation)
  expect(MembershipRequest).not.toBeCalled()
  expect(band.addMembershipRequest).not.toBeCalled()
  expect(band.save).not.toBeCalled()
})
