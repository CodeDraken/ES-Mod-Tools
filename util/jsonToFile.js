var mkdirp = require('mkdirp')
var fs = require('fs')
var getDirName = require('path').dirname

// convert object to JSON and write to file
const jsonToFile = (_path, obj) => {
  const json = JSON.stringify(obj, null, 2)

  console.log('writing JSON to: ', _path)

  if (json.length > 3) {
    mkdirp(getDirName(_path), (err) => {
      if (err) console.log('jsonToFile Error: ', err)

      fs.writeFileSync(_path, json)
    })
  } else {
    console.log('file looks empty, skipping: ', _path)
  }
}

const writeText = (_path, str) => {
  console.log('writing string to: ', _path)

  if (str.length > 3) {
    mkdirp(getDirName(_path), (err) => {
      if (err) console.log('jsonToFile Error: ', err)

      fs.writeFileSync(_path, str)
    })
  } else {
    console.log('file looks empty, skipping: ', _path)
  }
}

module.exports = { jsonToFile, writeText }
