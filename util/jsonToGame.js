// jsonToGame - Convert objects to a string that matches the game format

// convert an array of objects to game strings
const objArrToGame = (arr) => {
  return arr.map(obj => objToGame(obj))
}

// takes in an object and returns game formatted string
const objToGame = (obj) => {
  // initialize the string and add the first line
  let gameStr = obj._type + ' ' + obj._value + '\n'
  delete obj._value
  delete obj._type

  // begin looping the attributes starting at indent 1 ( 1 tab )
  gameStr += objLooper(obj, 1)

  return gameStr
}

const objLooper = (obj, indent) => {
  let gameStr = ''

  for (let key in obj) {
    const value = obj[key]
    const tabs = '\t'.repeat(indent)

    if (typeof value !== 'object') {
      // string & numerical values | "attr" value
      gameStr += tabs + key + ' ' + value + '\n'
    } else if (typeof value === 'object' && Array.isArray(value)) {
      // array value | prepend the key except for singles
      key = key !== 'singles' ? key : ''

      gameStr += value.reduce((str, val) =>
        str + tabs + key + ' ' + val + '\n',
      '')
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // object value | loop deeper
      gameStr += tabs + key + '\n' + objLooper(value, indent + 1)
    }
  }

  return gameStr
}

module.exports = {
  objToGame,
  objArrToGame
}
