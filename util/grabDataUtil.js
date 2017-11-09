// make grabbing data easy

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

const isPath = str => /\//g.test(str)

const eachAttrIn = (attr, dataName, callback) => {
  const selectedData = isPath(dataName)
    ? readDataPath(dataName)
    : data[dataName]

  for (let block of selectedData) {
    if (!block[attr]) continue

    callback(block[attr])
  }
}

const listAllPlanetAttributes = () => {
  const allAttr = []

  eachAttrIn('attributes', 'map/planets', (attributes) => {
    allAttr.push(...splitAtSpace(attributes))
  })

  return [...new Set(allAttr)]
}

const listGovernments = () => {
  const govs = []

  eachAttrIn('_value', 'globals/governments', (gov) => {
    govs.push(gov)
  })

  return govs
}

console.log(listGovernments())

module.exports = {
  data,
  eachAttrIn,
  listAllPlanetAttributes
}
