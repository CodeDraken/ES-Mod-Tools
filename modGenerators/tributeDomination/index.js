const mapPlanets = require('../../json/map/map-planets.json')
const mapSystems = require('../../json/map/map-systems.json')

const { generateModifierFile } = require('../../util/generateModifierFile')
const { listAllPlanetAttributes } = require('../../util/grabDataUtil')

generateModifierFile(
  [{ _path: '/globals/governments', grab: '_value' }],
  listAllPlanetAttributes(),
  '/tributeDomination',
  (dataToSanitize) => dataToSanitize.map(key => key.replace(/"/g, '').trim())
)
