const MembershipRequest = require('../../models/MembershipRequest')
const MembershipRequestConverter = require('./MembershipRequestConverter')

jest.mock('../../models/MembershipRequest')

it('converts MR IDs to Membership Requests', async ()=>{
  const membershipRequest = new MembershipRequest()
  MembershipRequest.findById.mockReturnValue(membershipRequest)

  const convertedRequest = await MembershipRequestConverter('12345')

  expect(convertedRequest).toBe(membershipRequest)
})

it('catches mongoose errors', async ()=>{
  MembershipRequest.findById.mockImplementation(()=>{
    throw 'Mongoose Error'
  })

  try {
    await MembershipRequestConverter('invalid')
  } catch (e) {
    expect(e).toBe('Invalid Membership Request ID')
  }
})