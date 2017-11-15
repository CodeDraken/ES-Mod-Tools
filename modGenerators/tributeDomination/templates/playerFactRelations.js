const declareWarAt = -1
// no allowing peace with these
const ignoreGov = [
  'Alpha', 'Author', 'Bounty', 'Bounty Hunter', 'Escort', 'Independent', 'Indigenous Lifeform', 'Korath Nanobots', 'Kor Mereti', 'Kor Sestor', 'Neutral', 'Parrot', 'Syndicate (Extremist)', 'Test Dummy'
]

// generates player faction relations with other governments
module.exports = (government) => {
  if (ignoreGov.includes(government)) return
  return `mission "Player Fact Declare War: ${government}"
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
			"Player Faction" -.5
	government "Player Faction"
		"attitude toward"
			"${government}" -.5
	"reputation: ${government}" = -100


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
			"Player Faction" .1
	government "Player Faction"
		"attitude toward"
			"${government}" .1
	"reputation: ${government}" = 5
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
}
