const GeoPoint = require('geopoint')
const Location = require('./Location')

jest.mock('GeoPoint')

beforeEach(()=>{
  jest.resetAllMocks()
})

it('can return a GeoPoint of its location', ()=>{
  const location = new Location({
    _geoJSON: {
      type: 'Point',
      coordinates: [90, -45]
    },
    _name: 'The Ocean'
  })

  const geoPoint = new GeoPoint()
  GeoPoint.mockReturnValue(geoPoint)

  expect(location.getGeoPoint()).toBe(geoPoint)
})

it('can calculate the distance between two locations', ()=>{
  const location = new Location({
    _geoJSON: {
      type: 'Point',
      coordinates: [90, -45]
    },
    _name: 'The Ocean'
  })

  const location2 = new Location({
    _geoJSON: {
      type: 'Point',
      coordinates: [90, -45]
    },
    _name: 'The Ocean'
  })

  const geoPoint = new GeoPoint()
  geoPoint.distanceTo.mockReturnValue(1)
  const geoPoint2 = new GeoPoint()
  GeoPoint.mockReturnValueOnce(geoPoint).mockReturnValueOnce(geoPoint2)


  expect(location.getDistanceTo(location2)).toBe(1)
  expect(geoPoint.distanceTo).toHaveBeenCalledWith(geoPoint2, true)
})
