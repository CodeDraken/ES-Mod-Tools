// CHEAP SHIPS
// adds discounted human ships to its own sales group
// ships have reduced stats

const { selectAllBlocksWith } = require('../../util/grabDataUtil')
const { objArrToGame } = require('../../util/jsonToGame')
const { writeText } = require('../../util/jsonToFile')
const { sanitizeStr } = require('../../util/stringUtil')
const { generateSales } = require('../../util/generateSales')

// all human ships
let ships = selectAllBlocksWith({ _type: 'ship' }, 'ships/ships')

const modifiers = {
  cost: 0.50,
  shields: 0.80,
  hull: 0.70,
  drag: 1.10,
  heavyShips: false
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
    '"drag"': ship.attributes['"drag"'] * modifiers.drag
  }
}))

// dont include heavy warships ( for some balance )
if (!modifiers.heavyShips) {
  ships = ships.filter(ship => ship.attributes.category !== '"Heavy Warship"')
}

const sales = generateSales('shipyard "Captured Ships"', ships.map(ship => ship._value))

// ships object to game file format
const shipsGameStr = objArrToGame(ships).join('\n')

// save to file
writeText('./modGenerators/cheapShips/cheap-ships/data/cheap-ships.txt', shipsGameStr)

writeText('./modGenerators/cheapShips/cheap-ships/data/cheap-sales.txt', sales)
