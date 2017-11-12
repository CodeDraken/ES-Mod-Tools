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

const { wordOrQuoted, tradeFleet } = require('../../config/regex')
const { generateModifierFile } = require('../../util/generateModifierFile')
const { listAllPlanetAttributes, selectAllBlocksWith, selectFrom } = require('../../util/grabDataUtil')
const { writeText } = require('../../util/jsonToFile')
const modifiers = require('./modifiers.json')

const planetsData = selectAllBlocksWith({ _type: 'planet' }, 'map/planets')
const systemsData = selectAllBlocksWith({ _type: 'system' }, 'map/systems')

// remove numbers & quotes
const sanitizeStr = str => str.replace(/ \d+/g, '').replace(/"/g, '').trim()

const createModifierFile = () => {
  generateModifierFile(
    [{ _path: '/globals/governments', grab: '_value' }],
    listAllPlanetAttributes(),
    '/tributeDomination',
    (dataToSanitize) => dataToSanitize.map(key => key.replace(/"/g, '').trim())
  )
}

const isOwnedFleet = (fleetStr, government) => {
  // all fleet names should be quoted and without the number to match properly
  const fleetName = '"' + sanitizeStr(fleetStr) + '"'
  const fleetObj = selectFrom('government', '/util/superFleets', { _value: fleetName })
    .replace(/"/g, '').trim()
  // grab the fleet and check the government value
  return government === fleetObj
}

const isTradeFleet = fleet => new RegExp(tradeFleet).test(fleet)

const modifyPlanets = (planets = planetsData) => {
  const modified = planets.map(planet => {
    const planetSystem = systemsData
    .find(system => {
      const planetValRe = planet._value.replace(/"?\\?/g, '')
      const re = new RegExp(String.raw`"_value":"\\?.?${planetValRe}\\?.?`, 'g')

      return system.object.some(object => object._value === planet._value) || re.test(JSON.stringify(system.object))
    })

    try {
      let { link = [], government = '', fleet = [] } = planetSystem
      let { attributes = '', shipyard = [], outfitter = [], _value = '', _type = '' } = planet
      let tributeVal = 1
      government = sanitizeStr(government)

      const numOfShipyards = Array.isArray(shipyard)
        ? shipyard.length
        : 1

      // make sure to use proper fleets
      if (Array.isArray(fleet) && fleet.some(f => /(Arach)|(Kimek)|(Saryd)/gi.test(f))) {
        // use heliarch
        government = 'Heliarch'
      } else if (/(Arach)|(Kimek)|(Saryd)/gi.test(fleet)) {
        government = 'Heliarch'
      } else if (Array.isArray(fleet) && fleet.some(f => /Militia/gi.test(f))) {
        // use militia
        government = 'Militia'
      } else if (/Militia/gi.test(fleet)) {
        government = 'Militia'
      }

      // convert string to array
      attributes = attributes
      ? attributes.match(wordOrQuoted)
      : []

      // sum up value of attributes, default to 1 if none
      const attrModifier = attributes
        .map(attr => modifiers[attr])
        .filter(attrModifier => !Number.isNaN(+attrModifier))
        .reduce((a, b) => { return a + b }, 1)

      // if link exists and is more than one multiplier is half # of links
      // else 0.5
      const linkModifier = Array.isArray(link)
        ? (link.length || 1) * 0.5
        : 0.5

      const ownedFleets = (Array.isArray(fleet)
        ? fleet.filter(f => isOwnedFleet(f, government) && !isTradeFleet(f))
        : isOwnedFleet(fleet, government) && !isTradeFleet(fleet)
          ? [fleet]
          : []
      ).map(f => sanitizeStr(f))

      // merchant fleets in the area & populate warFleets
      const merchantFleets = Array.isArray(fleet)
        ? fleet.filter(f => isTradeFleet(f)).map(f => sanitizeStr(f))
        : isTradeFleet(fleet)
          ? [fleet]
          : []

      tributeVal += modifiers[government] || 0
      tributeVal = tributeVal * attrModifier * linkModifier * (merchantFleets.length / 2 || 0.8)

      // amount of defense ships
      // growth constant the higher the number the more ships lesser factions will have and less for stronger factions
      const growthConst = 50000
      const minFleet = 5
      const minTotal = 10 + numOfShipyards
      const maxTotal = 45 + numOfShipyards * 3
      let fleetAmount = (growthConst / modifiers[government] + linkModifier + attrModifier - growthConst / tributeVal) << 0
      const totalShips = ownedFleets.length * fleetAmount

      // min & max fleets in total
      if (totalShips > maxTotal) {
        fleetAmount = (maxTotal / ownedFleets.length + Math.random() * 5) << 0
      } else if (totalShips < 10) {
        fleetAmount = (minTotal / ownedFleets.length + Math.random() * 5) << 0
      }

      if (tributeVal < fleetAmount * 100) {
        tributeVal = (fleetAmount * 100 + Math.random() * 2500) << 0
      }

      let defenseFleet = ownedFleets.map(f => {
        return `"${f}" ${(fleetAmount + Math.random() * 5) << 0}`
      })

      // replace empty planets with a random group
      if (!defenseFleet.length) {
        const possibleFleets = [
          [
            '"Small Northern Pirates" 10',
            '"Large Northern Pirates" 15'
          ],
          [
            '"Pug Arfecta Rand" 1'
          ],
          [
            '"Quarg" 5'
          ],
          [
            '"Marauder fleet X" 2',
            '"Hired Guns" 5',
            '"Marauder fleet IV" 1'
          ]

        ]
        defenseFleet = possibleFleets[(Math.random() * possibleFleets.length) << 0]
      }

      // console.log('--------------\n',
      //   tributeVal,
      //   modifiers[government], government,
      //   planet._value,
      //   attrModifier, attributes,
      //   linkModifier, link,
      //   ownedFleets,
      //   merchantFleets,
      //   fleet,
      //   '\n--------------'
      // )

      const updatedPlanet = {
        _type,
        _value,
        system: planetSystem._value,
        tribute: {
          '_value': tributeVal >> 0,
          'threshold': 1000,
          'fleet': defenseFleet
        }
      }

      // console.log(updatedPlanet)

      return updatedPlanet
    } catch (err) {
      const planetValRe = planet._value.replace(/"?\\?/g, '')
      const re = new RegExp(`"_value":.?${planetValRe}.?`, 'g')

      console.log(`failed for: ${planet._value}`, planetSystem)
      console.log(re)
      console.log(err)
    }
  })

  return modified
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
