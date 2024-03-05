function getRandomQuestions(data, ccc) {
  let selectedQuestions = []
  let selectedExplanations = []
  let selectedAllowNots = []

  // Function to get a random question and its corresponding explanation from an array of questions and explanations
  function getRandomQuestionWithExplanation(questions, explanations) {
    const randomIndex = Math.floor(Math.random() * questions.length)
    const question = questions[randomIndex]
    const explanation = explanations[randomIndex]
    return { question, explanation }
  }

  function getRandomQuestionWithExplanationAndAllowNots(
    questions,
    explanations,
    allowNots
  ) {
    const randomIndex = Math.floor(Math.random() * questions.length)
    const question = questions[randomIndex]
    const explanation = explanations[randomIndex]
    const allowNot = allowNots[randomIndex]
    return { question, explanation, allowNot }
  }

  // Loop to randomly select questions and explanations from each deck
  while (selectedQuestions.length < 5) {
    const randomDeckIndex = Math.floor(Math.random() * data.length)
    const deck = data[randomDeckIndex]

    // Check if the deck has questions and explanations
    if (
      deck.questions &&
      deck.questions.length > 0 &&
      deck.explanations &&
      deck.explanations.length > 0
    ) {
      if (ccc) {
        const { question, explanation, allowNot } =
          getRandomQuestionWithExplanationAndAllowNots(
            deck.questions,
            deck.explanations,
            deck.allowNots
          )
        selectedQuestions.push(question)
        selectedExplanations.push(explanation)
        selectedAllowNots.push(allowNot)
      } else {
        const { question, explanation } = getRandomQuestionWithExplanation(
          deck.questions,
          deck.explanations
        )
        selectedQuestions.push(question)
        selectedExplanations.push(explanation)
      }
    }
  }

  return {
    title: 'Random',
    questions: selectedQuestions,
    explanations: selectedExplanations,
    allowNots: selectedAllowNots,
  }
}

export default getRandomQuestions
