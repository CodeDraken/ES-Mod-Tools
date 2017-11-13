const declareWarAt = -1

// generates player faction relations with other governments
module.exports = (government) =>
`mission "Player Fact Declare War: ${government}"
	landing
	repeat
	to offer
		"reputation: ${government}" < ${declareWarAt}
		not "event: Player Fact Declare War: ${government}"
	on offer
		event "Player Fact Declare War: ${government}"
		fail

event "Player Fact Declare War: ${government}"
	government "${government}"
		"attitude toward"
			"Player Faction" -1000
	government "Player Faction"
		"attitude toward"
			"${government}" -1000
	"reputation: ${government}" = -1000


mission "Player Fact Make Peace: ${government}"
	job
	repeat
	name "Make peace with the ${government}"
	description "Make peace with the ${government}."
	to offer
		"reputation: ${government}" < ${declareWarAt}
		has "event: Player Fact Declare War: ${government}"
	source
		government "Player Faction"
	on accept
		event "Player Fact Make Peace: ${government}"
		clear "event: Player Fact Make Peace: ${government}"
		fail

event "Player Fact Make Peace: ${government}"
	clear "event: Player Fact Declare War: ${government}"
	government "${government}"
		"attitude toward"
			"Player Faction" 0
	government "Player Faction"
		"attitude toward"
			"${government}" 0
	"reputation: ${government}" = 0
	clear "event: Player Fact Make Peace: ${government}"


mission "Player Fact Force Peace: ${government}"
	landing
	repeat
	to offer
		"reputation: ${government}" > 1
		has "event: Player Fact Declare War: ${government}"
	on offer
		event "Player Fact Make Peace: ${government}"
		fail
`
