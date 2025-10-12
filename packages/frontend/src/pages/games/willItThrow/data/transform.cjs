 
const fs = require('fs')
const path = require('path')
const cccData = require('/Users/nateazevedo/Desktop/wdi/webdevinterviews/src/pages/games/willItThrow/data/random.json')

function transformArray() {
  // Initialize an empty array to store the transformed objects
  let transformedArray = []

  // Iterate over each object in the original array (cccData)
  for (let item of cccData) {
    item.newQuestions = []
    // Iterate over questions and explanations arrays to create new objects
    for (let i = 0; i < item.questions.length; i++) {
      // Create a new object with the question and explanation
      let transformedItem = {
        question: item.questions[i],
        explanation: item.explanations[i],
      }
      item.newQuestions.push(transformedItem)
      // Push the transformed object into the new array
    }
    delete item.questions
    delete item.explanations
    item.questions = [...item.newQuestions]
    delete item.newQuestions
    transformedArray.push(item)
  }

  // Return the transformed array
  return transformedArray
}

// Call the function and store the transformed array in a variable
const transformedData = transformArray()

// Convert the transformed array to JSON format
const jsonData = JSON.stringify(transformedData, null, 2)

// Specify the file path where you want to write the JSON data
const outputPath = path.join(__dirname, 'transformedrandom.json')

// Write the JSON data to the file
fs.writeFile(outputPath, jsonData, (err) => {
  if (err) {
    console.error('Error writing file:', err)
  } else {
    console.log('File has been successfully written:', outputPath)
  }
})
