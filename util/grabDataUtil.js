// make grabbing data easy
// TODO: refactor into multiple files & maybe add chaining

const { splitAtSpace } = require('./generalUtil')

// TODO: dynamically generate this
const data = {
  globals: {
    sales: require('../json/globals/sales.json'),
    governments: require('../json/globals/governments.json')
  },
  map: {
    planets: require('../json/map/map-planets.json'),
    systems: require('../json/map/map-systems.json')
  },
  util: {
    shipGenerationEquations: require('../json/util/generation_equations.json')
  }
}

// for using syntax like globals/sales to access the data object
const readDataPath = _path => {
  // each piece is a key
  const keys = _path.split('/')
  let selectedData

  while (keys.length) {
    // jump into data object or go deeper
    selectedData = selectedData
      ? selectedData[keys[0]]
      : data[keys[0]]

    keys.shift()
  }

  return selectedData
}

// special syntax to access data i.e global/sales
const isDataPath = str => /\//g.test(str)

// loop over blocks and call a function passing in a specific attribute from each one
const eachAttrIn = (attr, dataName, callback) => {
  const selectedData = isDataPath(dataName)
    ? readDataPath(dataName)
    : data[dataName]

  for (let block of selectedData) {
    if (!block[attr]) continue

    callback(block[attr])
  }
}

// TODO: selectFrom - select a value from an object

// TODO: selectBlockWith - select an object that has a specific value

// TODO: selectAllBlocksWith - select all objects that have a specific value

// returns array of all planet attributes
const listAllPlanetAttributes = () => {
  const allAttr = []

  eachAttrIn('attributes', 'map/planets', (attributes) => {
    allAttr.push(...splitAtSpace(attributes))
  })

  return [...new Set(allAttr)]
}

// returns array of governments
const listGovernments = () => {
  const govs = []

  eachAttrIn('_value', 'globals/governments', (gov) => {
    govs.push(gov)
  })

  return govs
}

module.exports = {
  data,
  isDataPath,
  readDataPath,
  eachAttrIn,
  listAllPlanetAttributes,
  listGovernments
}
