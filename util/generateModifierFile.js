// used to create modifiers for things
// i.e set a value for each government to be used as a multiplier for something
// modifiers just add a value to a reference

const { selectAllFrom } = require('./grabDataUtil')
const { jsonToFile } = require('./jsonToFile')
const { outputGameFiles } = require('../config/paths')

// attribute selecting queries, your own preselected data, output, and a callback if you want to modify the data first
const generateModifierFile = (arrSelectQueries, optionalData, outputDestination, sanitizer = (data) => data) => {
  // select the data
  const selectedData = []
  arrSelectQueries.forEach(({ _path, grab, makeUnique = false }) => {
    const selectedAttr = selectAllFrom(grab, _path)

    if (makeUnique) {
      selectedData.push(...new Set(selectedAttr))
    } else {
      selectedData.push(selectedAttr)
    }
  })

  const allDataFlattened = [...selectedData, ...optionalData].reduce((a, b) => a.concat(b), [])

  // make sure to include any optionally passed in data
  askValues(sanitizer(allDataFlattened), outputDestination)
}

// set modifiers in terminal
const askValues = (data, outputDestination) => {
  const stdin = process.openStdin()
  const modifiers = {}
  let i = 0

  console.log(`What value should ${data[i]} have?`)
  stdin.addListener('data', function (d) {
    let input = d.toString().trim()
    // if valid number make it a number
    input = +input
      ? +input
      : input

    // to skip enter in --
    if (input === '--') {
      console.log(`skipped: ${data[i]}`)
    } else {
      modifiers[data[i]] = input
      console.log(`${data[i]} set to: ${input}`)
    }
    i++

    if (i >= data.length) {
      stdin.destroy()
      console.log(`Questions complete. Modifiers set as: ${JSON.stringify(modifiers, null, 2)}`)
      console.log('writing to file...')
      jsonToFile(`${outputGameFiles}${outputDestination}`, modifiers)
    }

    console.log(`What value should ${data[i]} have?`)
  })
}

module.exports = {
  generateModifierFile
}
