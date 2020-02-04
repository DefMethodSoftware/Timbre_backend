const mongoose = require('mongoose');

let MembershipRequestSchema = new mongoose.Schema({
  band_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Band"
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  accepted: { type: Boolean, default: false }
})

MembershipRequestSchema.methods = {}

const MembershipRequest = mongoose.model('MembershipRequest', MembershipRequestSchema)

module.exports = MembershipRequest