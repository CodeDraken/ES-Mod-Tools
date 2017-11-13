const { sanitizeStr } = require('../../../util/stringUtil')

// generates player faction relations with other governments
module.exports = ({ fleetArr, government, systemName, planetName }) =>
`mission "Player Conquer: ${systemName}"
  job
  name "Conquer: ${systemName}"
  description "Take over the system in your name."
  to offer
    has "tribute: ${planetName}"
    not "event: Player Conquer: ${systemName}"
  npc evade
    government ${government}
    personality staying target
    ${fleetArr
      .map(fleet => sanitizeStr(fleet))
      .reduce((fleetStr, fleet) => {
        fleetStr += `fleet ${fleet}\n\t\t`
        return fleetStr
      }, '')}
  on accept
    conversation
      'You take control of the systems communication devices and announce that this system is yours now.'
      "You ready your ship captains to take the system..."
        launch
  on complete
    event "Player Conquer: ${systemName}"

  event "Player Conquer: ${systemName}"
  system "${systemName}"
      government "Player Faction"
      fleet "Small Player Fleet" 1500
      fleet "Large Player Fleet" 5000
`
