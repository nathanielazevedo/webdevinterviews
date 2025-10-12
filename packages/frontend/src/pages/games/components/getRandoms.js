function getRandomQuestions(data) {
  const selectedQuestions = []

  // Function to get a random question and its corresponding explanation from an array of questions and explanations
  function getRandomQuestionWithExplanation(questions) {
    const randomIndex = Math.floor(Math.random() * questions.length)
    const question = questions[randomIndex]
    return { question }
  }

  // Loop to randomly select questions and explanations from each deck
  while (selectedQuestions.length < 5) {
    const randomDeckIndex = Math.floor(Math.random() * data.length)
    const deck = data[randomDeckIndex]

    // Check if the deck has questions and explanations
    if (deck.questions && deck.questions.length > 0) {
      const { question } = getRandomQuestionWithExplanation(deck.questions)
      selectedQuestions.push(question)
    }
  }

  return {
    title: 'Random',
    questions: selectedQuestions,
  }
}

export default getRandomQuestions
