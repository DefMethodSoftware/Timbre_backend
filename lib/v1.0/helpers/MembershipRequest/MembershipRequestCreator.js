const MembershipRequest = require('../../models/MembershipRequest');

const create = async (user, band) => {
  if (!band.hasMissingInstrumentForUser(user)) {
    throw 'No open position for user in band'
  }

  // 2 km, I figure we'd later store this on the band owner and use it in the get bands endpoint 
  // e.g. .find().where(band.user.distance <= currentUser.distance)
  if (user.getLocation().getDistanceTo(band.getLocation()) > 2) {
    throw 'User is too far away from band'
  }

  let membershipRequest = new MembershipRequest({
            user: user.getId(),
            band: band.getId()
          })
  await membershipRequest.save()
  band.addMembershipRequest(membershipRequest)
  await band.save()
}

module.exports = create
