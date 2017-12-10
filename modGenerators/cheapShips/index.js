// CHEAP SHIPS
// adds discounted human ships to its own sales group
// ships have reduced stats

const { selectAllBlocksWith } = require('../../util/grabDataUtil')
const { objArrToGame } = require('../../util/jsonToGame')
const { writeText } = require('../../util/jsonToFile')
const { sanitizeStr } = require('../../util/stringUtil')
const { generateSales } = require('../../util/generateSales')

// all human ships | no licenses required
let ships = selectAllBlocksWith({ _type: 'ship' }, 'ships/ships')
  .map(ship => {
    delete ship.attributes.licenses
    return ship
  })

// planets to add the shipyard to | pirate planets with shipyards
let planets = selectAllBlocksWith({ _type: 'planet' }, 'map/planets')
  .filter(planet => planet.attributes && planet.attributes.includes('pirate'))
  .filter(planet => 'shipyard' in planet)
  .map(planet => planet._value)

const config = {
  shipyard: 'shipyard "Captured Ships"'
}

const modifiers = {
  cost: 0.50,
  shields: 0.80,
  hull: 0.70,
  drag: 1.10,
  heavyWarships: false
}

// dont include heavy warships ( for some balance )
if (!modifiers.heavyWarships) {
  ships = ships.filter(ship => ship.attributes.category !== '"Heavy Warship"')
}

// modify the ships reducing their stats and cost
ships = ships.map(ship => ({
  ...ship, // keep all values then override below
  _value: `"captured ${sanitizeStr(ship._value)}"`,
  attributes: {
    ...ship.attributes,
    '"cost"': ship.attributes['"cost"'] * modifiers.cost,
    '"shields"': ship.attributes['"shields"'] * modifiers.shields,
    '"hull"': ship.attributes['"hull"'] * modifiers.hull,
    '"drag"': +(ship.attributes['"drag"'] * modifiers.drag).toFixed(2)
  }
}))

const sales = generateSales(config.shipyard, ships.map(ship => ship._value))

// ships object to game file format
const shipsGameStr = objArrToGame(ships).join('\n')

// add shipyard to planets
const planetShipyards = planets.reduce((str, planet) =>
  str + 'planet ' + planet + '\n' + '\t' + 'add ' + config.shipyard + '\n\n'
, '')

// save to file
writeText('./modGenerators/cheapShips/cheap-ships/data/cheap-ships.txt', shipsGameStr)

writeText('./modGenerators/cheapShips/cheap-ships/data/cheap-sales.txt', sales)

writeText('./modGenerators/cheapShips/cheap-ships/data/cheap-shipyards.txt', planetShipyards)
