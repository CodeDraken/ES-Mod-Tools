// generateSales.js - takes in an array and returns it formatted as a game sales file

const generateSales = (typeName, arr) => arr.reduce((str, item) =>
  str + '\t' + item + '\n'
, typeName + '\n')

module.exports = {
  generateSales
}
