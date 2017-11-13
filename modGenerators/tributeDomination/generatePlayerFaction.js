const { allGovernments } = require('../../config/gameData')
const { sanitizeStr } = require('../../util/stringUtil')
const playerFactRelations = require('./templates/playerFactRelations')

const generatePlayerFaction = () => {
  // player rep with a faction required for player fact to declare war
  const relations = allGovernments
    .map(sanitizeStr)
    .map(playerFactRelations)
    .join('\n')

  return {
    relations
  }
}

module.exports = {
  generatePlayerFaction
}
