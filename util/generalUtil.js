const { wordOrQuoted } = require('../config/regex')

// will safely match strings split by space but not split inside a quote
const splitAtSpace = str => str.match(wordOrQuoted) || []

const firstNonQuotedSpace = str => {
  str = str.trim()
  const strArr = str
  let quoteBalance = 0

  // no quotes
  if (!/"/g.test(str)) return str.indexOf(' ')

  for (let i = 0; i < strArr.length; i++) {
    const char = str[i]

    if (char === '"') quoteBalance++

    if (char === ' ' && quoteBalance % 2 === 0) return i
  }

  return -1
}

module.exports = {
  firstNonQuotedSpace,
  splitAtSpace
}
