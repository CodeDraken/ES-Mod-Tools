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

const { wordOrQuoted } = require('../../config/regex')
const { generateModifierFile } = require('../../util/generateModifierFile')
const { listAllPlanetAttributes, selectAllBlocksWith } = require('../../util/grabDataUtil')

const planetsData = selectAllBlocksWith({ _type: 'planet' }, 'map/planets')
const systemsData = selectAllBlocksWith({ _type: 'system' }, 'map/systems')

const createModifierFile = () => {
  generateModifierFile(
    [{ _path: '/globals/governments', grab: '_value' }],
    listAllPlanetAttributes(),
    '/tributeDomination',
    (dataToSanitize) => dataToSanitize.map(key => key.replace(/"/g, '').trim())
  )
}

// TODO: Fix this shit
const modifyPlanets = (planets = planetsData) => {
  const modified = planets.map(planet => {
    const system = systemsData
    .find(system => system.object
      .some(object => {
        const re = new RegExp(String.raw`"_value": "\"?${planet._value}\"?"`, 'g')
        console.log(object)
        return object._value === planet._value || JSON.stringify(re.test(object))
      }))

    try {
      let { link, government, fleet } = system
      let { attributes, shipyard, outfitter } = planet
      console.log(system._value, planet._value)

      if (planet._value === 'Earth') console.log(system, planet)

      // convert string to array
      attributes = attributes
      ? attributes.match(wordOrQuoted)
      : []
    } catch (err) {
      console.log(`failed for: ${planet._value}`, system)
      console.log(err)
    }
  })

  return modified
}

modifyPlanets()

module.exports = {
  createModifierFile,
  modifyPlanets
}
