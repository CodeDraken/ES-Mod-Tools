// TRIBUTE DOMINATION
// Can demand tribute from all planets, tribute pay increased, can conquer any system / planet

const { modifyPlanets } = require('./modifyPlanets')
const { generateModifierFile } = require('../../util/generateModifierFile')
const { listAllPlanetAttributes } = require('../../util/grabDataUtil')
const { writeText } = require('../../util/jsonToFile')
const { generatePlanetMods, conquerablePlanets } = require('./modifyPlanets')
const { generatePlayerFaction } = require('./generatePlayerFaction')

const createModifierFile = () => {
  generateModifierFile(
    [{ _path: '/globals/governments', grab: '_value' }],
    listAllPlanetAttributes(),
    '/tributeDomination',
    (dataToSanitize) => dataToSanitize.map(key => key.replace(/"/g, '').trim())
  )
}

// TODO: refactor to a util function outside file
const generateMod = () => {
  const planetMods = generatePlanetMods()
  const playerFactRelations = generatePlayerFaction().relations

  writeText('./modGenerators/tributeDomination/tribute-domination/data/map.txt', planetMods.tributePlanets)
  writeText('./modGenerators/tributeDomination/tribute-domination/data/conquerablePlanets.txt', planetMods.conquerablePlanets)
  writeText('./modGenerators/tributeDomination/tribute-domination/data/playerFactionRelations.txt', playerFactRelations)
}

generateMod()

module.exports = {
  createModifierFile,
  modifyPlanets,
  generateMod
}
