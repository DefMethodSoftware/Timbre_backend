const MembershipRequest = require('../../models/MembershipRequest')

const convert = async (membershipRequestId) => {
  try {
    const membershipRequest = await MembershipRequest.findById(membershipRequestId)
    return membershipRequest
  } catch (e) {
    throw 'Invalid Membership Request ID'
  }
}

module.exports = convert