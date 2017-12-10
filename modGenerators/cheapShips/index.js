// CHEAP SHIPS
// adds discounted human ships to its own sales group
// ships have reduced stats

const { selectAllBlocksWith } = require('../../util/grabDataUtil')
const { objArrToGame } = require('../../util/jsonToGame')

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

// ships object to game file format
console.log(objArrToGame(ships))

// save to file
