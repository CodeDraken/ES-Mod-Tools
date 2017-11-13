const { sanitizeStr } = require('./stringUtil')
const { selectFrom } = require('./grabDataUtil')
const { tradeFleet } = require('../config/regex')

const isOwnedFleet = (fleetStr, government) => {
  // all fleet names should be quoted and without the number to match properly
  const fleetName = '"' + sanitizeStr(fleetStr) + '"'
  const fleetObj = selectFrom('government', '/util/superFleets', { _value: fleetName })
    .replace(/"/g, '').trim()
  // grab the fleet and check the government value
  return government === fleetObj
}

const isTradeFleet = fleet => new RegExp(tradeFleet).test(fleet)

module.exports = {
  isOwnedFleet,
  isTradeFleet
}
