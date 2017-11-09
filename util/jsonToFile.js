var mkdirp = require('mkdirp')
var fs = require('fs')
var getDirName = require('path').dirname

// convert object to JSON and write to file
const jsonToFile = (_path, obj) => {
  const json = JSON.stringify(obj, null, 2)

  console.log('writing: ', _path)

  if (json.length > 3) {
    mkdirp(getDirName(_path), (err) => {
      if (err) console.log('jsonToFile Error: ', err)

      fs.writeFileSync(_path, json)
    })
  } else {
    console.log('file looks empty, skipping: ', _path)
  }
}

module.exports = { jsonToFile }
