import { useState } from 'react'
import decks from './trueOrFalse.json'
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import TextLink from '../../../components/TextLink'

const TrueOrFalse = () => {
  const { id } = useParams()
  const deck = decks[id - 1]
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [guess, setGuess] = useState(null)
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.questions.length

  const onSubmit = (evt) => {
    evt.preventDefault()
    if (guess == eval(deck.questions[currentQuestion])) {
      setOutput('correct')
      scores.push(true)
      setScores([...scores])
    } else {
      setOutput('incorrect')
      scores.push(false)
      setScores([...scores])
    }

    setTimeout(() => {
      setGuess('')
      setOutput('')
      if (currentQuestion + 1 === deck.questions.length) {
        setOutput(
          `Game Over. Score ${countOccurances()} / ${deck.questions.length}`
        )
      }
      setCurrentQuestion(currentQuestion + 1)
    }, 1500)
  }

  const handleGuessChange = (evt) => {
    console.log(evt.target.value)
    setGuess(evt.target.value)
  }

  const newGame = (evt) => {
    evt.preventDefault()
    setCurrentQuestion(0)
    setScores([])
    setOutput('')
    setGuess(null)
  }

  const countOccurances = () => {
    let count = 0
    for (let each of scores) {
      if (each) count++
    }
    return count
  }

  return (
    <div className='fit-wrapper'>
      <TextLink to='/games/true-or-false' text='Back to decks' />
      <div className='gameEditor-container'>
        <div className='score-circles-container'>
          {Array(deck.questions.length)
            .fill()
            .map((_, index) => {
              return (
                <div
                  key={index}
                  className={
                    'score-circle ' +
                    (scores[index] === undefined
                      ? ''
                      : scores[index]
                      ? 'correct-score-circle'
                      : 'incorrect-score-circle')
                  }
                ></div>
              )
            })}
        </div>
        <div className='code-container'>
          <code>{deck.questions[currentQuestion]}</code>
          <form onSubmit={onSubmit} name='guess-form'>
            <div className='true-or-false-radio'>
              <div className='radio'>
                <div>
                  <label>
                    <input
                      type='radio'
                      name='guess'
                      value={1}
                      checked={guess === '1'}
                      onChange={handleGuessChange}
                    />
                    True
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type='radio'
                      name='guess'
                      value={0}
                      checked={guess === '0'}
                      onChange={handleGuessChange}
                    />
                    False
                  </label>
                </div>
              </div>
              {gameOver ? (
                <button type='button' onClick={newGame}>
                  Play Again
                </button>
              ) : (
                <button type='submit' disabled={guess === ''}>
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
        <div className='output-container'>
          <p>
            <samp>{output}</samp>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrueOrFalse
