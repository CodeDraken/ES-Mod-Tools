const path = require('path')

module.exports = {
  // regular game files
  dataLocation: path.join(__dirname, '../', 'data'),

  // mods
  outputGameFiles: path.join(__dirname, '../', 'generatedMods'),

  // mod generators
  modGenerators: path.join(__dirname, '../', 'modGenerators'),

  // JSON
  outputJSON: path.join(__dirname, '../', 'json')
}
