import fs from 'fs'
import path from 'path'

function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    const fileContents = {}
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
            const key = '/' + path.parse(filename).name + '.js'
            fileContents[key] = content
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

readFiles('./src/workouts/problems/react/checkedTree/demo')
  .then((fileContents) => {
    const asString = `export default ${JSON.stringify(fileContents)};`
    fs.writeFile(
      './src/workouts/problems/react/checkedTree/demo/asString.js',
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