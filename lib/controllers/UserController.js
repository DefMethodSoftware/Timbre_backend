const User = require('../models/User')
const createError = require('http-errors');
const IncomingUserParamValidator = require('../helpers/user/IncomingUserParamValidator')
const IncomingUserProfileParamValidator = require('../helpers/user/IncomingUserProfileParamValidator')

const createUserAction = async (body, res, next) => {
  let user = new User(body)
  try {
    IncomingUserParamValidator(body)
  } catch (e) {
    next(createError(400, e.message))
    return
  }

  try {
    await user.save()
    res.status(201).send(user.toAuthJSON())
  } catch (e) {
    next(createError(400, e.message))
  }
}

const updateUserAction = async (user, body, res, next) => {
  try {
    IncomingUserProfileParamValidator(body)
  } catch (e) {
    next(createError(400, e.message))
  }

  user.setProfile(body)
  try {
    await user.save()
    res.status(204).send()
  } catch (e) {
    next(createError(500, e.message))
  }
}


module.exports = {
  createUserAction: createUserAction,
  updateUserAction: updateUserAction
}