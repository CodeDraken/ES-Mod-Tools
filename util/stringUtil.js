// remove numbers & quotes
const sanitizeStr = str => str.replace(/ \d+/g, '').replace(/"/g, '').trim()

// remove quotes when not needed
const removeBadQuotes = str => /\s/g.test(str) ? str : str.replace(/"/g, '').trim()

// sanitize the keys in an object
const sanitizeKeys = obj => {
  let sanitized = {}

  for (let key in obj) {
    if (typeof obj[key] !== 'object') {
      sanitized[removeBadQuotes(key)] = obj[key]
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      sanitized[removeBadQuotes(key)] = sanitizeKeys(obj[key])
    } else {
      sanitized[removeBadQuotes(key)] = obj[key]
    }
  }

  return sanitized
}

module.exports = {
  sanitizeStr,
  removeBadQuotes,
  sanitizeKeys
}
