const Band = require('./Band')
const MembershipRequest = require('./MembershipRequest')

jest.mock('./MembershipRequest')

beforeEach(()=>{
  this.band = new Band({ 
    bandName: 'band',
    missingInstruments: { instrument: 1 },
    bio: 'band bio'    
  })
})

it('should be constructed with a band name, bio and set of missing instruments', ()=>{
  expect(this.band.bandName).toBe('band')
  expect(this.band.missingInstruments.instrument).toBe(1)
  expect(this.band.bio).toBe('band bio')
})

describe('#hasMembershipRequest', ()=>{
  it('returns true if the request relates to the band', ()=>{
    const membershipRequest = new MembershipRequest()
    membershipRequest.id = '12345'
    membershipRequest._id = '12345'

    this.band.getMembershipRequests = jest.fn()
    this.band.getMembershipRequests.mockReturnValue([membershipRequest])

    expect(this.band.hasMembershipRequest(membershipRequest)).toBe(true)
  })

  it('returns false if the request relates to the band', ()=>{
    const membershipRequest = new MembershipRequest()
    membershipRequest.id = '12345'
    membershipRequest._id = '12345'

    const bandMembershipRequest = new MembershipRequest()
    membershipRequest.id = '56789'
    membershipRequest._id = '56789'

    this.band.getMembershipRequests = jest.fn()
    this.band.getMembershipRequests.mockReturnValue([bandMembershipRequest])

    expect(this.band.hasMembershipRequest(membershipRequest)).toBe(false)
  })
})