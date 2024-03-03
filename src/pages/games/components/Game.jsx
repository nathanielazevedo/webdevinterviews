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
    setOutput('')
  }

  const goBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1)
    if (output) setOutput(null)
    setScores((prev) => {
      prev.pop()
      return [...prev]
    })
  }

  let onSubmit
  if (gameName == 'true-or-false') {
    onSubmit = (evt) => {
      if (evt.target.value == eval(currentQuestion)) {
        setOutput(true)
        setScores((prev) => [...prev, true])
      } else {
        setOutput(false)
        setScores((prev) => [...prev, false])
      }

      setTimeout(() => {
        setOutput(null)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 500)
    }
  } else if (gameName == 'will-it-throw') {
    onSubmit = (evt) => {
      const guess = evt.target.value
      try {
        currentQuestion.replaceAll('<br>', '').replaceAll('&nbsp;', '')
        eval(currentQuestion)
        if (guess === 'no') {
          setOutput('&#128077;')
          scores.push(true)
          setScores([...scores])
        } else {
          setOutput('&#128078;')
          scores.push(false)
          setScores([...scores])
        }
      } catch (e) {
        if (guess === 'yes') {
          setOutput('&#128077;' + e.toString())
          scores.push(true)
          setScores([...scores])
        } else {
          setOutput('&#128078;' + e.toString())
          scores.push(false)
          setScores([...scores])
        }
      }
      setTimeout(() => {
        setOutput(null)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 500)
    }
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
            <GameButtons onSubmit={onSubmit} disabled={output != null} />
          )}
        </div>
      </div>
      {!gameOver && <Explanation text={currentDeckExplanation} />}
    </>
  )
}

export default Game
