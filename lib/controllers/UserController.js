const User = require('../models/User')
const createError = require('http-errors');
const IncomingUserParamValidator = require('../helpers/user/IncomingUserParamValidator')
const IncomingUserProfileParamConverter = require('../helpers/user/IncomingUserProfileParamConverter')

const createUserAction = async (body, res, next) => {
  try {
    IncomingUserParamValidator(body)
  } catch (e) {
    next(createError(400, e))
    return
  }

  let user = new User(body)
  try {
    await user.save()
    res.status(201).send(user.toAuthJSON())
  } catch (e) {
    next(createError(400, e))
  }
}

const updateUserAction = async (user, body, res, next) => {
  let profile, location
  try {
    [profile, location] = await IncomingUserProfileParamConverter(body)
  } catch (e) {
    next(createError(400, e))
    return
  }

  user.setProfile(profile, location)
  try {
    await user.save()
    res.status(204).send()
  } catch (e) {
    next(createError(500, e))
  }
}


module.exports = {
  createUserAction: createUserAction,
  updateUserAction: updateUserAction
}
