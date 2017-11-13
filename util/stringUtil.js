// remove numbers & quotes
const sanitizeStr = str => str.replace(/ \d+/g, '').replace(/"/g, '').trim()

module.exports = {
  sanitizeStr
}
