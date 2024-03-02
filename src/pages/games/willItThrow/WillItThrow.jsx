import { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import structuredDecks from './data/structured.json'
import randomDecks from './data/random.json'
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
import { AuthContext } from '../../../contexts/AuthContext'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ScoreCircles from '../components/ScoreCircles'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Explanation from '../components/Explanation'

const WillItThrow = ({ random }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [number, setNumber] = useState(id ? id - 1 : 0)
  const decks = random ? randomDecks : structuredDecks
  const { displayName } = useContext(AuthContext)
  const [deck, setDeck] = useState(decks[number])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.questions.length

  useEffect(() => {
    if (number >= 4 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const onSubmit = (evt) => {
    const guess = evt.target.value
    try {
      const question = deck.questions[currentQuestion]
        .replaceAll('<br>', '')
        .replaceAll('&nbsp;', '')
      eval(question)
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
        setOutput('&#128077;')
        scores.push(true)
        setScores([...scores])
      } else {
        setOutput('&#128078;')
        scores.push(false)
        setScores([...scores])
      }
      setError(e)
    }

    setTimeout(() => {
      setOutput('')
      setError('')
      if (currentQuestion + 1 === deck.questions.length) {
        setOutput(
          `Game Over. <br> Score ${countOccurances()} / ${
            deck.questions.length
          }`
        )
      }
      setCurrentQuestion(currentQuestion + 1)
    }, 2000)
  }

  const newGame = () => {
    setCurrentQuestion(0)
    setScores([])
    setOutput('')
  }

  const countOccurances = () => {
    let count = 0
    for (let each of scores) {
      if (each) count++
    }
    return count
  }

  const goBack = () => {
    setCurrentQuestion((prev) => prev - 1)
    setOutput('')
    setScores((prev) => {
      prev.pop()
      return [...prev]
    })
  }

  return (
    <>
      {id && (
        <TextLink
          to='/games/will-it-throw'
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
            {deck.title}
          </Typography>
          <ScoreCircles length={deck.questions.length} scores={scores} />
        </div>
        <Screen output={output} code={deck.questions[currentQuestion]} />

        <div className='true-or-false-radio'>
          <Button disabled={currentQuestion == 0} onClick={goBack}>
            Go Back
          </Button>
          {gameOver ? (
            <Box>
              <ToggleButtonGroup exclusive size='small'>
                <ToggleButton onClick={newGame}>Play Again</ToggleButton>
                {!displayName && number >= 4 ? (
                  <ToggleButton
                    variant='outlined'
                    disabled={number >= decks.length - 1}
                    value={''}
                    onClick={() => {
                      let newNumber = number + 1
                      setNumber(newNumber)
                      setDeck(decks[newNumber])
                      newGame()
                      navigate(`/new-member`)
                    }}
                  >
                    Become a Member
                  </ToggleButton>
                ) : (
                  <ToggleButton
                    variant='outlined'
                    disabled={number >= decks.length - 1}
                    value={''}
                    onClick={() => {
                      let newNumber = number + 1
                      setNumber(newNumber)
                      setDeck(decks[newNumber])
                      newGame()
                      navigate(`/games/will-it-throw/${newNumber + 1}`)
                    }}
                  >
                    Next Deck
                  </ToggleButton>
                )}
              </ToggleButtonGroup>
            </Box>
          ) : (
            <div className='radio'>
              <ToggleButtonGroup
                exclusive
                onChange={onSubmit}
                value={''}
                disabled={output ? true : false}
                size='small'
                sx={{
                  display: gameOver ? 'none' : 'inherit',
                }}
              >
                <ToggleButton value={'yes'}>&nbsp; Yes &nbsp;</ToggleButton>
                <ToggleButton value={'no'}>&nbsp; No &nbsp;</ToggleButton>
              </ToggleButtonGroup>
            </div>
          )}
        </div>
      </div>
      <Typography color='error'>{error && error.toString()}</Typography>
      {!gameOver && <Explanation text={deck.explanations[currentQuestion]} />}
    </>
  )
}

export default WillItThrow
