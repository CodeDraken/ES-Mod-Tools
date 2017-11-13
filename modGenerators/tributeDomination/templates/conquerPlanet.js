const { sanitizeStr } = require('../../../util/stringUtil')

// generates player faction relations with other governments
module.exports = ({ fleetArr, government, systemName, planetName }) => {
  const sanitizedPlanetName = sanitizeStr(planetName)
  const sanitizedSystemName = sanitizeStr(systemName)
  const largeFleetChance = (2000 + Math.random() * 3000) >> 0
  const smallFleetChance = (500 + Math.random() * 1500) >> 0

  return `
mission "Player Conquer: ${sanitizedSystemName}"
	job
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
	fleet "Small Player Fleet" ${smallFleetChance}
	fleet "Large Player Fleet" ${largeFleetChance}
`
}
