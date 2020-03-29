const createObjArrayFromTable = (table) => {
  table = table.raw()
  return table.slice(1).reduce((result, val )=>{
    result.push(table[0].reduce((obj, key, index)=>{
      obj[key] = val[index]
      return obj
    }, {}))
    return result
  }, [])[0]
}

const instrumentArrayFromTableColumn = (col) => {
  if (col === 'none') {
    return 
  }
  return col.split(',').reduce((result, instrument) => {
    instrument = instrument.split(': ')
    result.instrument = instrument[0]
    result.rating = parseInt(instrument[1])
    return result
  }, {})
}

const locationObjFromTableColumn = (col) => {
  if (col === 'none') {
    return 
  }
  let location = {}
  let params = col.split(', ').map((param)=>{
    return param.split(': ')
  })
  location.friendlyLocation = params[0][1]
  location.coords = [params[1][1], params[2][1]]
  location.coords = location.coords.map(x=>Number.parseFloat(x))
  return location
}

const missingInstrumentsFromTableColumn = (col) => {
  col = col.split(", ")
  if (col[0] === 'none') {
    return {}
  }
  return col.reduce((result, string)=>{
    let [inst, count] = string.split(": ")
    result[inst.toLowerCase()] = parseInt(count)
    return result
  }, {})
}

module.exports = {
  createObjArrayFromTable: createObjArrayFromTable,
  instrumentArrayFromTableColumn: instrumentArrayFromTableColumn,
  locationObjFromTableColumn: locationObjFromTableColumn,
  missingInstrumentsFromTableColumn: missingInstrumentsFromTableColumn
}
