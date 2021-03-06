const mongoose = require('mongoose');

let BandSchema = new mongoose.Schema({
  bandName: {type: String, required: [true, "can't be blank"], index: true},
  missingInstruments: Object, // Object for quantity
  // location: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     default: "Point"
  //   },
  //   coordinates: {
  //     type: [Number],
  //     default: undefined
  //   }
  // },
  // locationFriendly: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  bio: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  membershipRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipRequest"
    }
  ]
}, {timestamps: true});

BandSchema.methods = {
  hasMembershipRequest: function(membershipRequest) {
    return this.getMembershipRequests().some((bandRequest) => {
      return membershipRequest.id == bandRequest._id
    })
  },
  getMembershipRequests: function() {
    return this.membershipRequests
  },
  addMembershipRequest: function(membershipRequest) {
    this.membershipRequests.push(membershipRequest)
  },
  hasMissingInstrumentForUser: function(user) {
    return user.getInstruments().some((instrumentObj)=>{
      return this.getMissingInstruments()[instrumentObj.instrument] > 0
    })
  },
  getMissingInstruments: function() {
    return this.missingInstruments
  },
  getLocation: function() {
    return this.location
  },
  getId: function() {
    return this.id
  },
  getBandName: function() {
    return this.bandName
  },
  getBio: function() {
    return this.bio
  }
}

const Band = mongoose.model('Band', BandSchema);

module.exports = Band
