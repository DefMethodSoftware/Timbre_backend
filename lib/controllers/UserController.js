const User = require('../models/User')
const createError = require('http-errors');

const createUserAction = async (body, res, next) => {
  let user = new User(body)
  try {
    await user.save()
    res.status(201).send(user.toAuthJSON())
  } catch (e) {
    next(createError(400, e.message))
  }
}

const updateUserAction = async (user, body, res, next) => {
  try {
    verifyProfileInfo(body)
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

const verifyProfileInfo = (profileInfo) => {
  if (!isValidCoords(profileInfo.location.coords)) {
    throw 'Bad location coordinates'
  }
}

const isValidCoords = ([long, lat]) => {
  if (long <= 180 &&
      long >= -180 &&
      lat <= 90 &&
      lat >= -90) {
    return true
  }
  
  return false
}

module.exports = {
  createUserAction: createUserAction,
  updateUserAction: updateUserAction
}