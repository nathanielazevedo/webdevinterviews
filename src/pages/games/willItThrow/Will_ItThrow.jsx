import { useState } from 'react'
import decks from './willItThrow.json'
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

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ScoreCircles from '../components/ScoreCircles'
import { useNavigate } from 'react-router-dom'

const WillItThrow = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [number, setNumber] = useState(id ? id - 1 : 0)
  const [deck, setDeck] = useState(decks[number])
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
        setOutput('&#128077;')
        scores.push(true)
        setScores([...scores])
      } else {
        setOutput('&#128078;')
        scores.push(false)
        setScores([...scores])
      }
    } catch (e) {
      console.log(e)
      if (guess === 'yes') {
        setOutput('&#128077;')
        scores.push(true)
        setScores([...scores])
      } else {
        setOutput('&#128078;')
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              color: 'grey.500',
            }}
          >
            Deck {number + 1}
          </Typography>
          <ScoreCircles deck={deck} scores={scores} />
        </div>

        <div className='code-container'>
          {output ? (
            <div
              className='output-container'
              dangerouslySetInnerHTML={{
                __html: output,
              }}
            ></div>
          ) : (
            <p
              style={{
                fontFamily: 'monospace',
              }}
              dangerouslySetInnerHTML={{
                __html: deck.questions[currentQuestion],
              }}
            ></p>
          )}
        </div>

        <div className='true-or-false-radio'>
          <div className='radio'>
            <ToggleButtonGroup
              value={guess}
              exclusive
              onChange={handleGuessChange}
              size='small'
              sx={{
                display: gameOver ? 'none' : 'inherit',
              }}
            >
              <ToggleButton value={'yes'}>&nbsp; Yes &nbsp;</ToggleButton>
              <ToggleButton value={'no'}>&nbsp; No &nbsp;</ToggleButton>
            </ToggleButtonGroup>
          </div>

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
            <Button variant='outlined' disabled={!guess} onClick={onSubmit}>
              Submit
            </Button>
          )}
        </div>
      </div>
      <Button
        variant='outlined'
        sx={{ width: '300px', margin: '0 auto' }}
        disabled={number >= decks.length - 1}
        onClick={() => {
          let newNumber = number + 1
          setNumber(newNumber)
          setDeck(decks[newNumber])
          newGame()
          navigate(`/games/wil-it-throw/${newNumber + 1}`, {
            replace: true,
          })
        }}
      >
        Next Deck
      </Button>
    </div>
  )
}

export default WillItThrow
