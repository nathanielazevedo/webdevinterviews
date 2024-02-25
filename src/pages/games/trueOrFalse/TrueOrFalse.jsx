import { useState, useEffect, useContext } from 'react'
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

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { AuthContext } from '../../../contexts/AuthContext'

const TrueOrFalse = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)
  const { id } = useParams()
  const [number, setNumber] = useState(id ? id - 1 : 0)
  const [deck, setDeck] = useState(decks[number])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [guess, setGuess] = useState(null)
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.questions.length

  useEffect(() => {
    if (number >= 4 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const onSubmit = () => {
    if (guess == eval(deck.questions[currentQuestion])) {
      setOutput('&#128077;')
      scores.push(true)
      setScores([...scores])
    } else {
      setOutput('&#128078;')
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
            <code>{deck.questions[currentQuestion]}</code>
          )}
        </div>

        <div className='true-or-false-radio'>
          <Box className='radio'>
            <ToggleButtonGroup
              value={guess}
              exclusive
              onChange={handleGuessChange}
              size='small'
              sx={{
                display: gameOver ? 'none' : 'inherit',
              }}
            >
              <ToggleButton value={'1'}>True</ToggleButton>
              <ToggleButton value={'0'}>False</ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
      {!displayName && number >= 4 ? (
        <Button
          variant='outlined'
          sx={{ width: '300px', margin: '0 auto' }}
          disabled={number >= decks.length - 1}
          onClick={() => {
            let newNumber = number + 1
            setNumber(newNumber)
            setDeck(decks[newNumber])
            newGame()
            navigate(`/new-member`)
          }}
        >
          Become a Member
        </Button>
      ) : (
        <Button
          variant='outlined'
          sx={{ width: '300px', margin: '0 auto' }}
          disabled={number >= decks.length - 1}
          onClick={() => {
            let newNumber = number + 1
            setNumber(newNumber)
            setDeck(decks[newNumber])
            newGame()
            navigate(`/games/true-or-false/${newNumber + 1}`)
          }}
        >
          Next Deck
        </Button>
      )}
    </>
  )
}

export default TrueOrFalse
