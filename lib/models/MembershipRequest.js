const mongoose = require('mongoose');

const VALID_STATUSES = ['accepted', 'declined']

let MembershipRequestSchema = new mongoose.Schema({
  band: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Band"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  accepted: { type: Boolean, default: false },
  declined: { type: Boolean, default: false }
})

MembershipRequestSchema.methods = {
  isActioned: function() {
    return this.accepted || this.declined
  },
  setRequestStatus: function(params) {
    Object.keys(params).map((key)=>{
      if(!VALID_STATUSES.includes(key)){
        throw 'Invalid request status'
      }
      this[key] = params[key]
    })
  }
}

const MembershipRequest = mongoose.model('MembershipRequest', MembershipRequestSchema)

module.exports = MembershipRequest
