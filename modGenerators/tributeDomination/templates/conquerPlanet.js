const { sanitizeStr } = require('../../../util/stringUtil')

// generates player faction relations with other governments
module.exports = (system, planet) =>
`mission "Player Conquer: ${system}"
job
name "Conquer: ${system._value}"
description "Take over the system in your name."
to offer
	has "tribute: ${planet}"
	not "event: Player Conquer: ${system._value}"
npc evade
	government ${system.government}
	personality staying target
	${system.fleet
		.map(fleet => sanitizeStr(fleet))
		.reduce((fleetStr, fleet) => {
  fleetStr += `fleet ${fleet}`
  return fleetStr
}, '')}
on accept
	conversation
		'You take control of the systems communication devices and announce that this system is yours now.'
		"You ready your ship captains to take the system..."
			launch
on complete
	event "Player Conquer: ${system._value}"

event "Player Conquer: ${system._value}"
system "${system._value}"
		government "Player Faction"
		fleet "Small Player Fleet" 1500
		fleet "Large Player Fleet" 5000
`
