const MembershipRequest = require('./MembershipRequest')

beforeEach(()=>{
  this.membershipRequest = new MembershipRequest()
})

describe('#isActioned', ()=>{
  it('returns true when accepted', ()=>{
    this.membershipRequest.accepted = true
    expect(this.membershipRequest.isActioned()).toBe(true)
  })

  it('returns true when declined', ()=>{
    this.membershipRequest.declined = true
    expect(this.membershipRequest.isActioned()).toBe(true)
  })
})

describe('#setRequestStatus', ()=>{
  it('sets accepted', ()=>{
    this.membershipRequest.setRequestStatus({accepted: true})
    expect(this.membershipRequest.accepted).toBe(true)
  })

  it('sets accepted', ()=>{
    this.membershipRequest.setRequestStatus({declined: true})
    expect(this.membershipRequest.declined).toBe(true)
  })

  it('throws for any other property', ()=>{
    expect(()=>{
      this.membershipRequest.setRequestStatus({thing: true})
      }).toThrow('Invalid request status')
  })
})

