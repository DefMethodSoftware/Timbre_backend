const GeoPoint = require('geopoint')
const MembershipRequest = require('../../models/MembershipRequest');
const Band = require('../../models/Band');
const User = require('../../models/User');
const MembershipRequestCreator = require('./MembershipRequestCreator')

jest.mock('geopoint')
jest.mock('../../models/MembershipRequest')
jest.mock('../../models/Band')
jest.mock('../../models/User')

beforeEach(()=>{
  jest.resetAllMocks()
})

it('creates a Membership Request', async ()=>{
  const user = new User()
  user.getLocation.mockReturnValue({ coords: [1, 2]})
  user.getId.mockReturnValue('12345')

  const band = new Band()
  band.getLocation.mockReturnValue({ coordinates: [3, 4]})
  band.getId.mockReturnValue('67890')
  band.hasMissingInstrumentForUser.mockReturnValue(true)

  userGeoPoint = new GeoPoint()
  bandGeoPoint = new GeoPoint()
  GeoPoint.mockReturnValueOnce(userGeoPoint).mockReturnValueOnce(bandGeoPoint)
  userGeoPoint.distanceTo.mockReturnValue(1)

  const membershipRequest = new MembershipRequest()
  let membershipRequestParams
  MembershipRequest.mockImplementation((params)=>{
    membershipRequestParams = params
    return membershipRequest
  })

  await MembershipRequestCreator(user, band)

  expect(band.hasMissingInstrumentForUser).toBeCalledWith(user)
  expect(GeoPoint).toBeCalledWith(1, 2)
  expect(GeoPoint).toBeCalledWith(3, 4)
  expect(userGeoPoint.distanceTo).toBeCalledWith(bandGeoPoint, true)
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
  expect(GeoPoint).not.toBeCalled()
  expect(band.addMembershipRequest).not.toBeCalled()
  expect(band.save).not.toBeCalled()
})


it('Throws if the user is too far away from the band', async ()=>{
  const user = new User()
  user.getLocation.mockReturnValue({ coords: [1, 2]})

  const band = new Band()
  band.getLocation.mockReturnValue({ coordinates: [3, 4]})
  band.hasMissingInstrumentForUser.mockReturnValue(true)

  userGeoPoint = new GeoPoint()
  bandGeoPoint = new GeoPoint()
  GeoPoint.mockReturnValueOnce(userGeoPoint).mockReturnValueOnce(bandGeoPoint)
  userGeoPoint.distanceTo.mockReturnValue(3)

  try {
    await MembershipRequestCreator(user, band)
  } catch(e) {
    expect(e).toBe('User is too far away from band')
  }

  expect(band.hasMissingInstrumentForUser).toBeCalledWith(user)
  expect(GeoPoint).toBeCalledWith(1, 2)
  expect(GeoPoint).toBeCalledWith(3, 4)
  expect(userGeoPoint.distanceTo).toBeCalledWith(bandGeoPoint, true)
  expect(MembershipRequest).not.toBeCalled()
  expect(band.addMembershipRequest).not.toBeCalled()
  expect(band.save).not.toBeCalled()
})