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
  accepted: { type: Boolean, default: false },
  declined: { type: Boolean, default: false }
})

MembershipRequestSchema.methods = {

  setRequestStatus: function(params) {
    Object.keys(params).map((key)=>{
      this[key] = params[key]
    })
  }
}

const MembershipRequest = mongoose.model('MembershipRequest', MembershipRequestSchema)

module.exports = MembershipRequest
