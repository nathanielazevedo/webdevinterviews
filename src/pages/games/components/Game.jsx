import { useState } from 'react'

import Screen from './Screen'
import Explanation from './Explanation'
import GameHead from './GameHead'
import BackButton from './BackButton'
import GameOverButtons from './GameOverButtons'
import GameButtons from './GameButtons'

const Game = ({ deck, pastFreeDecks, goNextDeck, isLastDeck, gameName }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [output, setOutput] = useState(null)
  const [scores, setScores] = useState([])

  const deckLength = deck.questions.length
  const gameOver = currentQuestionIndex >= deckLength
  const currentScore = scores.reduce((cum, curr) => (curr ? cum + 1 : cum), 0)
  const currentQuestion = deck.questions[currentQuestionIndex]
  const currentDeckExplanation = deck.explanations[currentQuestionIndex]

  const newGame = () => {
    setCurrentQuestionIndex(0)
    setScores([])
    setOutput(null)
  }

  const goBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1)
    if (output) setOutput(null)
    setScores((prev) => {
      prev.pop()
      return [...prev]
    })
  }

  const handleCorrectInput = () => {
    setOutput(true)
    setScores((prev) => [...prev, true])
  }

  const handleIncorrectInput = () => {
    setOutput(false)
    setScores((prev) => [...prev, false])
  }

  const onSubmit = (evt) => {
    const input = evt.target.value
    const cleanedQuestion = currentQuestion
      .replaceAll('<br>', '')
      .replaceAll('&nbsp;', '')

    if (gameName == 'true-or-false') {
      if (input == eval(cleanedQuestion)) handleCorrectInput()
      else handleIncorrectInput()
    } else if (gameName == 'will-it-throw') {
      try {
        eval(cleanedQuestion)
        if (input === 'no') handleCorrectInput()
        else handleIncorrectInput()
      } catch (e) {
        if (input === 'yes') handleCorrectInput()
        else handleIncorrectInput()
      }
    }

    setTimeout(() => {
      setOutput(null)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }, 500)
  }

  return (
    <>
      <div className='game-container'>
        <GameHead scores={scores} title={deck.title} length={deckLength} />
        <Screen
          output={output}
          gameOver={gameOver}
          code={currentQuestion}
          deckLength={deckLength}
          currentScore={currentScore}
        />
        <div className='game-buttons'>
          <BackButton goBack={goBack} disabled={currentQuestionIndex == 0} />
          {gameOver ? (
            <GameOverButtons
              newGame={newGame}
              isLastDeck={isLastDeck}
              goNextDeck={goNextDeck}
              pastFreeDecks={pastFreeDecks}
            />
          ) : (
            <GameButtons
              gameName={gameName}
              onSubmit={onSubmit}
              disabled={output != null}
            />
          )}
        </div>
      </div>
      {!gameOver && <Explanation text={currentDeckExplanation} />}
    </>
  )
}

export default Game
