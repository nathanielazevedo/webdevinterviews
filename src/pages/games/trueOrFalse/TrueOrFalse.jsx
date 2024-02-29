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
import Screen from '../components/Screen'
import Explanation from '../components/Explanation'
import FireWorks from '../../../components/fireworks/Fireworks'

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

  const onSubmit = (evt) => {
    if (evt.target.value == eval(deck.questions[currentQuestion])) {
      setOutput('&#128077;')
      scores.push(true)
      setScores([...scores])
    } else {
      setOutput('&#128078;')
      scores.push(false)
      setScores([...scores])
    }

    setTimeout(() => {
      setOutput('')
      if (currentQuestion + 1 === deck.questions.length) {
        setOutput(
          `Game Over. <br> Score ${countOccurances()} / ${
            deck.questions.length
          }`
        )
      }
      setCurrentQuestion(currentQuestion + 1)
    }, 1500)
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
          <Typography sx={{ color: 'grey.500' }}>Deck {number + 1}</Typography>
          <ScoreCircles deck={deck} scores={scores} />
        </div>

        <Screen output={output} code={deck.questions[currentQuestion]} />

        <div className='true-or-false-radio'>
          {gameOver ? (
            <>
              <Box>
                <ToggleButtonGroup value={guess} exclusive size='small'>
                  <ToggleButton onClick={newGame}>Play Again</ToggleButton>
                  {!displayName && number >= 4 ? (
                    <ToggleButton
                      variant='outlined'
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
                      onClick={() => {
                        let newNumber = number + 1
                        setNumber(newNumber)
                        setDeck(decks[newNumber])
                        newGame()
                        navigate(`/games/true-or-false/${newNumber + 1}`)
                      }}
                    >
                      Next Deck
                    </ToggleButton>
                  )}
                </ToggleButtonGroup>
              </Box>
            </>
          ) : (
            <Box>
              <ToggleButtonGroup
                exclusive
                onChange={onSubmit}
                size='small'
                disabled={output ? true : false}
                sx={{
                  display: gameOver ? 'none' : 'inherit',
                }}
              >
                <ToggleButton value={'1'}>True</ToggleButton>
                <ToggleButton value={'0'}>False</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </div>
      </div>
      {gameOver && countOccurances() / deck.questions.length == 1 && (
        <FireWorks />
      )}
      {!gameOver && <Explanation text={deck.explanations[currentQuestion]} />}
    </>
  )
}

export default TrueOrFalse
