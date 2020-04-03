const MembershipRequest = require('../models/MembershipRequest')
const MembershipRequestCreator = require('../helpers/MembershipRequest/MembershipRequestCreator.js')
const createError = require('http-errors');

const createMembershipRequestAction = async (user, band, res, next) => {
  try {
    await MembershipRequestCreator(user, band)
    res.status(201).send()
  } catch (e) {
    next(createError(400, e))
  }
}

const viewMembershipRequestsAction = async (user, res, next) => {
  if (user.getBands().length < 1) {
    return next(createError(400, 'User has no bands'))
  }
  const membershipRequests = await MembershipRequest.find()
    .where('band')
    .in(user.bands)
    .and([{ accepted: false }, { declined: false }])
    .exec()
  return res.status(200).send({ membershipRequests: membershipRequests })
}

const updateMembershipRequestAction = async (user, band, membershipRequest, body, res, next) => {
  if (!user.ownsBand(band)) {
    next(createError(401, "Not authorized to manipulate Band"))
    return
  }
  if (!band.hasMembershipRequest(membershipRequest)) {
    next(createError(400, "Request not for given Band"))
    return
  }
  if(membershipRequest.isActioned()) {
    next(createError(400, 'Request already actioned'))
    return
  }
  membershipRequest.setRequestStatus(body)
  await membershipRequest.save()
  res.status(200).send()
}

module.exports = {
  createMembershipRequestAction: createMembershipRequestAction,
  viewMembershipRequestsAction: viewMembershipRequestsAction,
  updateMembershipRequestAction: updateMembershipRequestAction
}
