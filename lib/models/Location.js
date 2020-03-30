const GeoPoint = require('geopoint')
const mongoose = require('mongoose');

let LocationSchema = new mongoose.Schema({
  _geoJSON: {
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
  _name: String
}, {timestams: true})

LocationSchema.methods = {
  getGeoPoint: function() {
    return new GeoPoint(this.getLongitude(), this.getLatitude())
  },
  getGeoJSON: function() {
    return this._geoJSON
  },
  getLongitude: function() {
    return this._geoJSON.coordinates[0]
  },
  getLatitude: function() {
    return this._geoJSON.coordinates[1]
  },
  getName: function() {
    return this._name
  },
  getId: function() {
    return this._id
  }
}

LocationSchema.index({ _geoJSON: '2dsphere' });

const Location = mongoose.model('Location', LocationSchema)
Location.ensureIndexes((err)=>{
  if (err) {console.log(err)}
})

module.exports = Location
