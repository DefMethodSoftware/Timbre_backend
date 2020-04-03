const BandConverter = require('./BandConverter')
const Band = require('../../models/Band')

jest.mock('../../models/Band')

it('converts a band ID into a band', async ()=>{
  const band = new Band()
  Band.findById.mockReturnValue(Band)
  Band.populate.mockReturnValue(band)

  const convertedBand = await BandConverter('123456')

  expect(convertedBand).toBe(band)
})

it('catches mongoose errors', async ()=>{
  Band.findById.mockImplementationOnce(()=>{
    throw 'Mongoose error'
  })
  try {
    await BandConverter('invalid')
  } catch (e) {
    expect(e).toBe('Invalid Band ID')
  }
})
