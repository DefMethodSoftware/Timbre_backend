const MembershipRequestController = require('./MembershipRequestController')
const User = require('../models/User')
const Band = require('../models/Band')
const MembershipRequest = require('../models/MembershipRequest')
const MembershipRequestCreator = require('../helpers/MembershipRequest/MembershipRequestCreator.js')
const createError = require('http-errors');

jest.mock('http-errors')
jest.mock('../models/User')
jest.mock('../models/Band')
jest.mock('../models/MembershipRequest')
jest.mock('../helpers/MembershipRequest/MembershipRequestCreator')

describe('#createMembershipRequestAction', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks()

    this.res = {
      status: jest.fn().mockImplementation(()=>{
        return this.res
      }),
      send: jest.fn()
    }
    this.next = jest.fn()
  })

  it('creates membership requests', async ()=>{
    const user = new User()
    const band = new Band()

    await MembershipRequestController.createMembershipRequestAction(user, band, this.res, this.next)

    expect(MembershipRequestCreator).toBeCalledWith(user, band)
    expect(this.res.status).toBeCalledWith(201)
    expect(this.res.send).toBeCalled()
  })

  it('catches creator errors', async ()=>{
    const user = new User()
    const band = new Band()
    MembershipRequestCreator.mockImplementation(()=>{
      throw 'Creator Error'
    })
    const error = createError()
    createError.mockReturnValue(error)

    await MembershipRequestController.createMembershipRequestAction(user, band, this.res, this.next)

    expect(MembershipRequestCreator).toBeCalledWith(user, band)
    expect(createError).toBeCalledWith(400, 'Creator Error')
    expect(this.next).toBeCalledWith(error)
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })
})

describe('#viewMembershipRequestsAction', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks()

    this.result = null
    this.res = {
      status: jest.fn().mockImplementation(()=>{
        return this.res
      }),
      send: jest.fn().mockImplementation((result)=>{
        this.result = result
      })
    }
    this.next = jest.fn()
  })

  it('returns a list of membership requests', async ()=>{
    const user = new User()
    const band = new Band()
    const membershipRequests = [new MembershipRequest()]
    user.getBands.mockReturnValue([band])
    const query = {
      where: jest.fn(),
      in: jest.fn(),
      and: jest.fn(),
      exec: jest.fn()
    }
    query.where.mockReturnValue(query)
    query.in.mockReturnValue(query)
    query.and.mockReturnValue(query)
    query.exec.mockReturnValue(membershipRequests)
    MembershipRequest.find.mockReturnValue(query)

    await MembershipRequestController.viewMembershipRequestsAction(user, this.res, this.next)

    expect(user.getBands).toBeCalledTimes(1)
    expect(MembershipRequest.find).toBeCalledTimes(1)
    expect(this.res.status).toBeCalledWith(200)
    expect(this.result.membershipRequests).toBe(membershipRequests)
  })

  it('returns bad request if user has no bands', async ()=>{
    const user = new User()
    user.getBands.mockReturnValue([])
    const error = createError()
    createError.mockReturnValue(error)

    await MembershipRequestController.viewMembershipRequestsAction(user, this.res, this.next)

    expect(user.getBands).toBeCalledTimes(1)
    expect(createError).toBeCalledWith(400, 'User has no bands')
    expect(this.next).toBeCalledWith(error)
    expect(MembershipRequest.find).not.toBeCalled()
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })
})

describe('#updateMembershipRequestAction', ()=>{
  beforeEach(()=>{
    jest.resetAllMocks()

    this.res = {
      status: jest.fn().mockImplementation(()=>{
        return this.res
      }),
      send: jest.fn()
    }
    this.next = jest.fn()
  })

  it('updates a membership request', async ()=>{
    const user = new User()
    user.ownsBand.mockReturnValue(true)
    const band = new Band()
    band.hasMembershipRequest.mockReturnValue(true)
    const membershipRequest = new MembershipRequest()
    membershipRequest.isActioned.mockReturnValue(false)
    const body = {}

    await MembershipRequestController.updateMembershipRequestAction(
      user,
      band,
      membershipRequest,
      body,
      this.res,
      this.next
      )

    expect(user.ownsBand).toBeCalledWith(band)
    expect(band.hasMembershipRequest).toBeCalledWith(membershipRequest)
    expect(membershipRequest.isActioned).toBeCalledTimes(1)
    expect(membershipRequest.setRequestStatus).toBeCalledWith(body)
    expect(membershipRequest.save).toBeCalledTimes(1)
    expect(this.res.status).toBeCalledWith(200)
    expect(this.res.send).toBeCalledTimes(1)
  })

  it('returns unauthorized if user doesnt own band', async ()=>{
    const user = new User()
    user.ownsBand.mockReturnValue(false)
    const band = new Band()
    const membershipRequest = new MembershipRequest()
    const body = {}

    await MembershipRequestController.updateMembershipRequestAction(
      user,
      band,
      membershipRequest,
      body,
      this.res,
      this.next
      )

    expect(user.ownsBand).toBeCalledWith(band)
    expect(band.hasMembershipRequest).not.toBeCalled()
    expect(membershipRequest.isActioned).not.toBeCalled()
    expect(membershipRequest.setRequestStatus).not.toBeCalled()
    expect(membershipRequest.save).not.toBeCalled()
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })

  it('returns bad request if band isnt associated with request', async ()=>{
    const user = new User()
    user.ownsBand.mockReturnValue(true)
    const band = new Band()
    band.hasMembershipRequest.mockReturnValue(false)
    const membershipRequest = new MembershipRequest()
    const body = {}

    await MembershipRequestController.updateMembershipRequestAction(
      user,
      band,
      membershipRequest,
      body,
      this.res,
      this.next
      )

    expect(user.ownsBand).toBeCalledWith(band)
    expect(band.hasMembershipRequest).toBeCalledWith(membershipRequest)
    expect(membershipRequest.isActioned).not.toBeCalled()
    expect(membershipRequest.setRequestStatus).not.toBeCalled()
    expect(membershipRequest.save).not.toBeCalled()
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })

  it('returns bad request if membership request previously actioned', async ()=>{
    const user = new User()
    user.ownsBand.mockReturnValue(true)
    const band = new Band()
    band.hasMembershipRequest.mockReturnValue(true)
    const membershipRequest = new MembershipRequest()
    membershipRequest.isActioned.mockReturnValue(true)
    const body = {}

    await MembershipRequestController.updateMembershipRequestAction(
      user,
      band,
      membershipRequest,
      body,
      this.res,
      this.next
      )

    expect(user.ownsBand).toBeCalledWith(band)
    expect(band.hasMembershipRequest).toBeCalledWith(membershipRequest)
    expect(membershipRequest.isActioned).toBeCalledTimes(1)
    expect(membershipRequest.setRequestStatus).not.toBeCalled()
    expect(membershipRequest.save).not.toBeCalled()
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })
})