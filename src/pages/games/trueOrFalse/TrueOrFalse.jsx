import { useState } from 'react'
import decks from './trueOrFalse.json'
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import TextLink from '../../../components/TextLink'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
} from '@mui/material'
import ScoreCircles from '../components/ScoreCircles'
import { useNavigate } from 'react-router-dom'

const TrueOrFalse = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [number, setNumber] = useState(id ? id - 1 : 0)
  const [deck, setDeck] = useState(decks[number])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [guess, setGuess] = useState(null)
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.questions.length

  const onSubmit = (evt) => {
    evt.preventDefault()
    if (guess == eval(deck.questions[currentQuestion])) {
      setOutput('You are right.')
      scores.push(true)
      setScores([...scores])
    } else {
      setOutput('You are wrong.')
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
    setGuess(evt.target.value)
  }

  const newGame = () => {
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
    <>
      {id && (
        <TextLink
          to='/games/true-or-false'
          text='Back to decks'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
      )}

      <div className='gameEditor-container'>
        <Typography
          sx={{
            position: 'absolute',
            right: 15,
            color: 'grey.500',
          }}
        >
          Deck {number + 1}
        </Typography>
        <ScoreCircles deck={deck} scores={scores} />

        <div className='code-container'>
          <code>{deck.questions[currentQuestion]}</code>
        </div>

        <form
          onSubmit={onSubmit}
          name='guess-form'
          className='true-or-false-radio'
        >
          <Box className='radio'>
            <FormControl
              sx={{
                display: gameOver ? 'none' : 'inherit',
              }}
            >
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                defaultValue='female'
                name='radio-buttons-group'
                row
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label='True'
                  checked={guess === '1'}
                  onChange={handleGuessChange}
                />
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label='False'
                  checked={guess === '0'}
                  onChange={handleGuessChange}
                />
              </RadioGroup>
            </FormControl>

            {gameOver ? (
              <Button
                type='button'
                variant='outlined'
                fullWidth
                onClick={newGame}
              >
                Play Again
              </Button>
            ) : (
              <Button type='submit' variant='outlined' disabled={!guess}>
                Submit
              </Button>
            )}
          </Box>
        </form>

        <div className='output-container'>{output}</div>
      </div>
      <Button
        variant='outlined'
        sx={{ width: '300px', margin: '0 auto' }}
        disabled={number >= decks.length - 1}
        onClick={() => {
          let newNumber = number + 1
          navigate(`/games/true-or-false/${newNumber}`)
        }}
      >
        Next Deck
      </Button>
    </>
  )
}

export default TrueOrFalse
