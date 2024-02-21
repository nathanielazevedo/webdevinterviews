import { useState } from 'react'
import decks from './willItThrow.json'
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import TextLink from '../../../components/TextLink'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

const WillItThrow = () => {
  const { id } = useParams()
  const deck = decks[id - 1]
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [guess, setGuess] = useState('')
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.questions.length

  const onSubmit = (evt) => {
    evt.preventDefault()
    try {
      console.log(deck.questions[currentQuestion])
      eval(deck.questions[currentQuestion])
      if (guess === 'no') {
        setOutput('correct')
        scores.push(true)
        setScores([...scores])
      } else {
        setOutput('incorrect')
        scores.push(false)
        setScores([...scores])
      }
    } catch (e) {
      console.log(e)
      if (guess === 'yes') {
        setOutput('correct')
        scores.push(true)
        setScores([...scores])
      } else {
        setOutput('incorrect')
        scores.push(false)
        setScores([...scores])
      }
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
    setGuess(evt.target.value)
  }

  const newGame = (evt) => {
    evt.preventDefault()
    setCurrentQuestion(0)
    setScores([])
    setOutput('')
    setGuess('')
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
      <TextLink
        to='/games/will-it-throw'
        text='Back to decks'
        icon={<ArrowBackIosIcon fontSize='5px' />}
      />
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
        </div>

        <form
          onSubmit={onSubmit}
          name='guess-form'
          className='true-or-false-radio'
        >
          <div className='radio'>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label>
                <input
                  type='radio'
                  name='guess'
                  value='yes'
                  checked={guess === 'yes'}
                  onChange={handleGuessChange}
                />
                Yes
              </label>
              <label>
                <input
                  type='radio'
                  name='guess'
                  value='no'
                  checked={guess === 'no'}
                  onChange={handleGuessChange}
                />
                No
              </label>
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

        <div className='output-container'>
          <p>
            <samp>{output}</samp>
          </p>
        </div>
      </div>
    </div>
  )
}

export default WillItThrow
