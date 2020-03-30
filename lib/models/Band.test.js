const Band = require('./Band')
const MembershipRequest = require('./MembershipRequest')
const User = require('./User')

jest.mock('./MembershipRequest')
jest.mock('./User')

beforeEach(()=>{
  jest.resetAllMocks()

  this.band = new Band({ 
    bandName: 'band',
    missingInstruments: { drums: 1 },
    bio: 'band bio'    
  })
})

it('should be constructed with a band name, bio and set of missing instruments', ()=>{
  expect(this.band.getBandName()).toBe('band')
  expect(this.band.getMissingInstruments()).toHaveProperty('drums')
  expect(this.band.getBio()).toBe('band bio')
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

describe('#hasMissingInstrumentForUser', ()=>{
  it('returns true when band has an available instrument for the user', ()=>{
    const user = new User()
    user.getInstruments.mockReturnValue([
        { instrument: 'drums', rating: 5 }
      ])

    expect(this.band.hasMissingInstrumentForUser(user)).toBe(true)
  })

  it('returns false when band has no available instrument for the user', ()=>{
    const user = new User()
    user.getInstruments.mockReturnValue([
        { instrument: 'guitar', rating: 5 }
      ])

    expect(this.band.hasMissingInstrumentForUser(user)).toBe(false)
  })
})