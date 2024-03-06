import { useState } from 'react'

import Screen from './Screen'
import Explanation from './Explanation'
import GameHead from './GameHead'
import BackButton from './BackButton'
import GameOverButtons from './GameOverButtons'
import GameButtons from './GameButtons'

import correctSound from '../sounds/correctSound.wav'
import incorrectSound from '../sounds/incorrectSound.mp3'
import { Typography } from '@mui/material'

const Game = ({
  deck,
  pastFreeDecks,
  goNextDeck,
  isLastDeck,
  gameName,
  playSound,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [output, setOutput] = useState(null)
  const [scores, setScores] = useState([])
  const [errorType, setErrorType] = useState()

  const deckLength = deck.questions.length
  const gameOver = currentQuestionIndex >= deckLength
  const currentScore = scores.reduce((cum, curr) => (curr ? cum + 1 : cum), 0)
  const currentQuestionInfo = deck.questions[currentQuestionIndex]
  const currentQuestion = currentQuestionInfo?.question
  const currentDeckExplanation = currentQuestionInfo?.explanation
  const allowNots =
    gameName != 'ccc' ? undefined : currentQuestionInfo?.allowNots

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
    if (playSound) {
      var audio = new Audio(correctSound)
      audio.play()
    }
    setOutput(true)
    setScores((prev) => [...prev, true])
  }

  const handleIncorrectInput = () => {
    if (playSound) {
      var audio = new Audio(incorrectSound)
      audio.play()
    }
    setOutput(false)
    setScores((prev) => [...prev, false])
  }

  const onSubmit = (evt) => {
    const input = evt.target.value
    const cleanedQuestion = currentQuestion
      .replaceAll('<br>', '')
      .replaceAll('&nbsp;', '')

    if (gameName == 'true-or-false') {
      try {
        if (input == eval(cleanedQuestion)) handleCorrectInput()
        else handleIncorrectInput()
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`)
      }
    } else if (gameName == 'will-it-throw') {
      try {
        eval(cleanedQuestion)
        if (input === 'no') handleCorrectInput()
        else handleIncorrectInput()
      } catch (e) {
        setErrorType(e.toString())
        if (input === 'yes') handleCorrectInput()
        else handleIncorrectInput()
      }
    } else if (gameName == 'ccc') {
      const questionWithInput = cleanedQuestion.replaceAll('???', input)
      try {
        const result = eval(questionWithInput)
        if (result) handleCorrectInput()
        else handleIncorrectInput()
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`)
      }
    }

    setTimeout(() => {
      setOutput(null)
      setErrorType('')
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
              allowNots={allowNots}
              disabled={output != null}
            />
          )}
        </div>
      </div>
      {!gameOver && <Explanation text={currentDeckExplanation} />}
      {errorType && <Typography color='error'>{errorType}</Typography>}
    </>
  )
}

export default Game
