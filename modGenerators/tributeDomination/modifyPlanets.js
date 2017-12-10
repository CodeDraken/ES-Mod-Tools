const { sanitizeStr } = require('../../util/stringUtil')
const { isOwnedFleet, isTradeFleet } = require('../../util/fleetUtil')
const { wordOrQuoted } = require('../../config/regex')
const { selectAllBlocksWith } = require('../../util/grabDataUtil')
const modifiers = require('./modifiers.json')
const conquerPlanet = require('./templates/conquerPlanet')

const systemsData = selectAllBlocksWith({ _type: 'system' }, 'map/systems')
const planetsData = selectAllBlocksWith({ _type: 'planet' }, 'map/planets')

let conquerablePlanets = ''

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
            '"Rand Defense Fleet" 1'
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

      conquerablePlanets += conquerPlanet({
        fleetArr: Array.isArray(fleet) ? fleet : [fleet],
        government,
        systemName: planetSystem._value,
        planetName: _value,
        links: Array.isArray(link) ? link : [link],
        shipyard: 'shipyard' in planet
      }) + '\n'

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

const generatePlanetMods = () => {
  const moddedPlanets = modifyPlanets()
  let tributePlanets = ''

  moddedPlanets.forEach(planet => {
    let fleets = ''

    planet.tribute.fleet.forEach(fleet => {
      fleets += `\t\tfleet ${fleet}\n`
    })

    tributePlanets += (
      `planet ${planet._value}\n` +
      `\ttribute ${planet.tribute._value}\n` +
      `\t\tthreshold ${planet.tribute.threshold}\n` +
      `${fleets}` +
      '\n'
      )
  })

  return {
    conquerablePlanets,
    tributePlanets
  }
}

module.exports = {
  modifyPlanets,
  generatePlanetMods
}
