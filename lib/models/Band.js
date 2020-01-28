const mongoose = require('mongoose');

let BandSchema = new mongoose.Schema({
  bandName: {type: String, required: [true, "can't be blank"], index: true},
  missingInstruments: Object,
  location: Object,
  bio: String
}, {timestamps: true});

BandSchema.methods = {
}

const Band = mongoose.model('Band', BandSchema);

module.exports = Band
