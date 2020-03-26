const MembershipRequest = require('../../models/MembershipRequest');

const create = async (user, band, callback) => {
  let membershipRequest = new MembershipRequest({
            user: user.id,
            band: band.id
          })
  await membershipRequest.save()
  band.membershipRequests.push(membershipRequest)
  await band.save()
  callback()
}

module.exports = {
  create: create
}
