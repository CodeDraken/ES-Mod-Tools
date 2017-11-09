const path = require('path')

module.exports = {
  // regular game files
  dataLocation: path.join(__dirname, '../', 'data'),

  // mod generators
  modGenerators: path.join(__dirname, '../', 'modGenerators'),

  // JSON
  outputJSON: path.join(__dirname, '../', 'json')
}
