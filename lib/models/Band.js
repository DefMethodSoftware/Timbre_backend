const mongoose = require('mongoose');

let BandSchema = new mongoose.Schema({
  bandName: {type: String, required: [true, "can't be blank"], index: true},
  missingInstruments: Object, // Object for quantity
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  locationFriendly: String,
  bio: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

BandSchema.methods = {
  
}
BandSchema.index({ location: '2dsphere' });

const Band = mongoose.model('Band', BandSchema);
Band.ensureIndexes(function (err) {
  if (err) return console.log(err);
});

module.exports = Band
