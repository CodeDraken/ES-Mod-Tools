const { selectBlockWith } = require('../../../util/grabDataUtil')
const { sanitizeStr } = require('../../../util/stringUtil')

// generates player faction relations with other governments
module.exports = ({ fleetArr, government, systemName, planetName, links }) => {
  const sanitizedPlanetName = sanitizeStr(planetName)
  const sanitizedSystemName = sanitizeStr(systemName)
  const largeFleetChance = (2000 + Math.random() * 3000) >> 0
  const smallFleetChance = (500 + Math.random() * 1500) >> 0

	// invade nearby territories
  const linkedFleets = links.reduce((gameStr, link) => {
    const linkedSystem = selectBlockWith({ _value: link }, 'map/systems')
    const linkedFleet = Array.isArray(linkedSystem.fleet) ? linkedSystem.fleet : [linkedSystem.fleet]

//   ${linkedFleet
//     .reduce((fleetStr, fleet) => {
// fleetStr += `fleet ${fleet}\n\t\t`
// return fleetStr
// }, '')}

    gameStr += `
	system "${link}"
		add fleet "Small Player Fleet" ${smallFleetChance}
		add fleet "Large Player Fleet" ${largeFleetChance}
`

    return gameStr
  }, '')

  return `
mission "Player Conquer: ${sanitizedSystemName}"
  job
  repeat
	name "Conquer: ${sanitizedSystemName}"
	description "Take over the system in your name."
	source "${sanitizedPlanetName}"
	to offer
		has "tribute: ${sanitizedPlanetName}"
		not "event: Player Conquer: ${sanitizedSystemName}"
	npc evade
		government ${government}
		personality staying target
		${fleetArr
			.map(fleet => sanitizeStr(fleet))
			.reduce((fleetStr, fleet) => {
  fleetStr += `fleet "${fleet}" ${((Math.random() * 5) >> 0) + 1}\n\t\t`
  return fleetStr
}, '')}
	on accept
		conversation
			"You take control of all of the communication devices in this sector and announce that this system is yours now. Anyone who resists will be obliterated."
			"You ready your ship captains to take the system..."
				launch
	on complete
		event "Player Conquer: ${sanitizedSystemName}"

event "Player Conquer: ${sanitizedSystemName}"
	system "${sanitizedSystemName}"
		government "Player Faction"
		add fleet "Small Player Fleet" ${smallFleetChance}
		add fleet "Large Player Fleet" ${largeFleetChance}
	${linkedFleets}
`
}

// ${fleetArr
//   .reduce((fleetStr, fleet) => {
// fleetStr += `fleet ${fleet}\n\t\t`
// return fleetStr
// }, '')}
