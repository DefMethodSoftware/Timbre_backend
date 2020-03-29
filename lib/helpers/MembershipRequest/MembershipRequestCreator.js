const MembershipRequest = require('../../models/MembershipRequest');

const create = async (user, band) => {
  let membershipRequest = new MembershipRequest({
            user: user.id,
            band: band.id
          })
  band.membershipRequests.push(membershipRequest)
  await membershipRequest.save()
  await band.save()
}

module.exports = create