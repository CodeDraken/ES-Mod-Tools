// always use new RegExp when using these, mostly when it has |
module.exports = {
  wordOrQuoted: /\w+|"(?:\\"|[^"])+"/gm,
  tradeFleet: /(cargo)|(merchant)|(freight)|(Arach)|(Kimek)|(Saryd)|(Miner)/gi
}
