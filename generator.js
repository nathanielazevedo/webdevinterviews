/* eslint-disable no-undef */
import fs from 'fs'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Type: ', (type) => {
  const templatePath = `./src/workouts/problems/react/switch/${type}`
  const asStringPath = `./src/workouts/problems/react/switch/${type}/asString.js`

  readFiles(templatePath).then((fileContents) => {
    const asString = `export default ${JSON.stringify(fileContents)};`
    fs.writeFile(asStringPath, asString, function (err) {
      if (err) {
        console.error(err)
      }
    })
  })

  rl.close()
})

function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    const fileContents = {}
    const asStringPath = path.join(dirname, 'asString.js')
    if (fs.existsSync(asStringPath)) {
      fs.unlinkSync(asStringPath)
    }
    fs.readdir(dirname, function (err, filenames) {
      if (err) {
        reject(err)
        return
      }
      let count = filenames.length
      filenames.forEach(function (filename) {
        fs.readFile(
          path.join(dirname, filename),
          'utf-8',
          function (err, content) {
            if (err) {
              reject(err)
              return
            }
            const ext =
              path.parse(filename).ext === '.jsx'
                ? '.js'
                : path.parse(filename).ext
            const key = '/' + path.parse(filename).name + ext
            fileContents[key] = { code: content }
            count--
            if (count === 0) {
              resolve(fileContents)
            }
          }
        )
      })
    })
  })
}

readFiles('./src/workouts/problems/react/switch/demo')
  .then((fileContents) => {
    const asString = `export default ${JSON.stringify(fileContents)};`
    fs.writeFile(
      './src/workouts/problems/react/switch/demo/asString.js',
      asString,
      function (err) {
        if (err) {
          console.error(err)
        }
      }
    )
  })
  .catch((err) => {
    console.error(err)
  })
