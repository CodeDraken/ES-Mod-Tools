// used to create modifiers for things
// i.e set a value for each government to be used as a multiplier for something
// modifiers just add a value to a reference

const { listGovernments } = require('./grabDataUtil')

// pass in what you want to have as modifiers and the destination
// i.e [ '/global/governments' ], '/modifiers'
const generateModifierFile = (dataArrToSelect, outputDestination) => {

}

// set modifiers in terminal
const askValues = data => {
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

    modifiers[data[i]] = input
    console.log(`${data[i]} set to: ${input}`)
    i++

    if (i >= data.length) {
      stdin.destroy()
      console.log(`Questions complete. Modifiers set as: ${JSON.stringify(modifiers, null, 2)}`)
      return modifiers
    }

    console.log(`What value should ${data[i]} have?`)
  })
}

// askValues(listGovernments())
