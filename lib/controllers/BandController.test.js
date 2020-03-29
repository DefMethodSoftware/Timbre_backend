const BandController = require('./BandController')
const Band = require('../models/Band');
const User = require('../models/User');
const MembershipRequest = require('../models/MembershipRequest');
const IncomingBandParamConverter = require('../helpers/Band/IncomingBandParamConverter')
const createError = require('http-errors');

jest.mock('../models/Band')
jest.mock('../models/User')
jest.mock('../models/MembershipRequest')
jest.mock('http-errors')
jest.mock('../helpers/Band/IncomingBandParamConverter')

beforeEach(()=>{

})

describe('#createBandAction', ()=>{
  beforeEach(()=>{
    this.res = { 
      status: jest.fn(),
      json: jest.fn()
    }
    this.next = jest.fn()
    this.user = new User()

    Band.mockReset()
    User.mockReset()
  })

  it('creates a band', async ()=>{
    const body = jest.mock()
    const incomingBand = jest.mock()
    const band = new Band()
    IncomingBandParamConverter.mockReturnValueOnce(incomingBand)
    this.res.status.mockReturnValueOnce(this.res)
    Band.mockReturnValueOnce(band)

    await BandController.createBandAction(this.user, body, this.res, this.next)

    expect(IncomingBandParamConverter).toHaveBeenCalledWith(body, this.user)
    expect(Band).toHaveBeenCalledWith(incomingBand)
    expect(this.user.addBand).toHaveBeenCalledWith(band)
    expect(band.save).toHaveBeenCalled()
    expect(this.user.save).toHaveBeenCalled()
    expect(this.res.status).toHaveBeenCalledWith(201)
    expect(this.res.json).toHaveBeenCalledWith('Band created successfully')
  })

  it('catches band param converter exceptions', async ()=>{
    const body = jest.mock()
    const error = { message: "Error Message" }
    IncomingBandParamConverter.mockImplementation(()=>{
      throw 'Error Message'
    })
    createError.mockReturnValueOnce(error)

    await BandController.createBandAction(this.user, body, this.res, this.next)

    expect(IncomingBandParamConverter).toHaveBeenCalledWith(body, this.user)
    expect(createError).toHaveBeenCalledWith(400, 'Error Message')
    expect(this.next).toHaveBeenCalledWith(error)

    expect(Band).not.toHaveBeenCalled()
    expect(this.res.status).not.toHaveBeenCalled()
    expect(this.res.json).not.toHaveBeenCalled()
  })
})

describe('#viewBandsAction', ()=>{
  beforeEach(()=>{
    this.res = { 
      status: jest.fn().mockImplementation(()=>{
        return this.res
      }),
      send: jest.fn()
    }
    this.next = jest.fn()
    this.user = new User()
    User.find.mockReset()
    Band.find.mockReset()
    MembershipRequest.find.mockReset()
  })

  it('renders a list of bands', async ()=>{
    const query = {
      or: jest.fn().mockImplementation(()=>{return query}),
      and: jest.fn().mockImplementation(()=>{return query})
    }
    this.user.location = true //truthy value to pass verification TODO: this should check it's valid...
    this.user.getInstruments.mockReturnValueOnce([ { instrument: 'drums' }])
    MembershipRequest.find.mockReturnValueOnce([])
    Band.find.mockReturnValueOnce(query)

    await BandController.viewBandsAction(this.user, this.res, this.next)

    expect(this.user.getInstruments).toHaveBeenCalled()
    expect(MembershipRequest.find).toHaveBeenCalled()
    expect(Band.find).toHaveBeenCalled()
    expect(this.res.status).toHaveBeenCalledWith(200)
    expect(this.res.send).toHaveBeenCalled()
  })

  it('it throws if the user has not set their location', async ()=>{
    const query = {
      or: jest.fn().mockImplementation(()=>{return query}),
      and: jest.fn().mockImplementation(()=>{return query})
    }
    const error = { message: "Error Message" }
    this.user.location = false
    createError.mockReturnValueOnce(error)

    await BandController.viewBandsAction(this.user, this.res, this.next)

    expect(createError).toHaveBeenCalledWith(400, 'User Profile Not Set')
    expect(this.next).toHaveBeenCalledWith(error)

    expect(MembershipRequest.find).not.toHaveBeenCalled()
    expect(Band.find).not.toHaveBeenCalled()
    expect(this.res.status).not.toHaveBeenCalled()
    expect(this.res.send).not.toHaveBeenCalled()
  })
})