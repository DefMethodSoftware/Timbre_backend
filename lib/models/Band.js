const mongoose = require('mongoose');

let BandSchema = new mongoose.Schema({
  bandName: {type: String, required: [true, "can't be blank"], index: true},
  missingInstruments: Object,
  location: [Number],
  locationFriendly: String,
  bio: String
}, {timestamps: true});

BandSchema.methods = {
}
BandSchema.index({ location: '2dsphere' });

const Band = mongoose.model('Band', BandSchema);

module.exports = Band
