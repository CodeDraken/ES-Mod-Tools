// always use new RegExp when using these, especially when it has |
module.exports = {
  wordOrQuoted: /\w+|"(?:\\"|[^"])+"/gm,
  tradeFleet: /(cargo)|(merchant)|(freight)|(Arach)|(Kimek)|(Saryd)|(Miner)/gi,
  pirateFleet: /(pirate)|(pirate)|(pirate)|/gi
}
