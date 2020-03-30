const UserController = require('./UserController')
const User = require('../models/User')
const createError = require('http-errors');
const IncomingUserParamValidator = require('../helpers/user/IncomingUserParamValidator')
const IncomingUserProfileParamValidator = require('../helpers/user/IncomingUserProfileParamValidator')

jest.mock('../models/User')
jest.mock('http-errors')
jest.mock('../helpers/user/IncomingUserParamValidator')
jest.mock('../helpers/user/IncomingUserProfileParamValidator')

describe('#createUserAcion', ()=>{
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

  it('creates a new user', async ()=>{
    const body = {}
    const user = new User()
    const userJSON = {}
    User.mockReturnValueOnce(user)
    user.toAuthJSON.mockReturnValueOnce(userJSON)

    await UserController.createUserAction(body, this.res, this.next)

    expect(IncomingUserParamValidator).toBeCalledWith(body)
    expect(User).toBeCalledWith(body)
    expect(user.save).toBeCalledTimes(1)
    expect(this.res.status).toBeCalledWith(201)
    expect(this.res.send).toBeCalledWith(userJSON)
  })

  it('catches param validation errors', async ()=>{
    const body = {}
    IncomingUserParamValidator.mockImplementation(()=>{
      throw 'Validation Error'
    })
    const error = createError()
    createError.mockReturnValueOnce(error)

    await UserController.createUserAction(body, this.res, this.next)

    expect(createError).toBeCalledWith(400, 'Validation Error')
    expect(this.next).toBeCalledWith(error)
    expect(User).not.toBeCalled()
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })

  it('catches user save errors', async ()=>{
    const body = {}
    const user = new User()
    user.save.mockImplementation(()=>{
      throw 'User Save Error'
    })

    User.mockReturnValueOnce(user)
    const error = createError()
    createError.mockReturnValueOnce(error)

    await UserController.createUserAction(body, this.res, this.next)

    expect(IncomingUserParamValidator).toBeCalledWith(body)
    expect(user.save).toBeCalledTimes(1)
    expect(createError).toBeCalledWith(400, 'User Save Error')
    expect(this.next).toBeCalledWith(error)
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })
})

describe('#updateUserAction', ()=>{
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

  it('updates the user profile', async ()=>{
    const body = {}
    const user = new User()

    await UserController.updateUserAction(user, body, this.res, this.next)

    expect(IncomingUserProfileParamValidator).toBeCalledWith(body)
    expect(user.setProfile).toBeCalledWith(body)
    expect(user.save).toBeCalledTimes(1)
    expect(this.res.status).toBeCalledWith(204)
    expect(this.res.send).toBeCalledTimes(1)
  })

  it('catches param validation errors', async ()=>{
    const body = {}
    const user = new User()
    const error = createError()

    IncomingUserProfileParamValidator.mockImplementation(()=>{
      throw 'Validation Error'
    })
    createError.mockReturnValueOnce(error)

    await UserController.updateUserAction(user, body, this.res, this.next)

    expect(IncomingUserProfileParamValidator).toBeCalledWith(body)
    expect(createError).toBeCalledWith(400, 'Validation Error')
    expect(user.setProfile).not.toBeCalled()
    expect(user.save).not.toBeCalled()
    expect(this.next).toBeCalledWith(error)
    expect(this.res.status).not.toBeCalled()
    expect(this.res.send).not.toBeCalled()
  })
})