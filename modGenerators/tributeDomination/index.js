// TRIBUTE DOMINATION
// Can demand tribute from all planets, tribute pay increased

// Defense fleets will be based on / influenced by:
// - the faction that owns it ( so merchant ships in the area aren't used as defense )
// - fleets in the area ( type of ships that guard it )
// - tribute value ( how many ships guard it )

// Tribute reward will be based on / influenced by:
// - planet attributes ( i.e "paradise" planets will obviously have some dosh) min 0.1 max 5
// - number of links ( more links = more trade routes ) * 1
// - owner faction ( some factions will / can pay more or less ) static value min 2500 max 50000
// - mineables in the area ( small increase ) * 1
// - trade fleets in the area ( more trade ships must mean it's more profitable? ) * 2 each fleet

// Also, I think I'll lower the required combat rating because you can have a low combat rating and still be considered a serious threat. i.e a merchant captain who decided to sell his merchant ships and buy an army of war ship would be a serious threat to any planet.

// Required combat rating will be based on / influenced by:
// - government ( fixed value for each gov )
// - defense fleet ( multiplier for amount of defense ships )
// - will have a limit so ridiculous combat ratings won't be required.

const { modifyPlanets } = require('./modifyPlanets')
const { generateModifierFile } = require('../../util/generateModifierFile')
const { listAllPlanetAttributes } = require('../../util/grabDataUtil')
const { writeText } = require('../../util/jsonToFile')

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
  const moddedPlanets = modifyPlanets()
  let modStr = ''

  moddedPlanets.forEach(planet => {
    let fleets = ''

    planet.tribute.fleet.forEach(fleet => {
      fleets += `\t\tfleet ${fleet}\n`
    })

    modStr += (
    `planet ${planet._value}\n` +
    `\ttribute ${planet.tribute._value}\n` +
    `\t\tthreshold ${planet.tribute.threshold}\n` +
    `${fleets}` +
    '\n'
    )
  })

  return modStr
}

writeText('./modGenerators/tributeDomination/tribute-domination/data/map.txt', generateMod())

module.exports = {
  createModifierFile,
  modifyPlanets,
  generateMod
}
