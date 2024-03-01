import { useState, useContext, useEffect } from 'react'
import questions from './transformedData.json'
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
import { AuthContext } from '../../../contexts/AuthContext'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ScoreCircles from '../components/ScoreCircles'
import { useNavigate } from 'react-router-dom'
import Screen from '../components/Screen'
import Explanation from '../components/Explanation'

function selectRandomItems() {
  const shuffledArray = questions.sort(() => Math.random() - 0.5)
  return shuffledArray.slice(0, 5)
}

function getPage(paramsId) {
  if (!paramsId) return 0
  else if (paramsId == 'random') return 'random'
  else return paramsId
}

function getDeck(page) {
  if (page == 'random') {
    return selectRandomItems()
  } else {
    return questions.slice(page * 5, page * 5 + 5)
  }
}

const Ccc = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)
  const { id: paramsId } = useParams()

  const [page, setPage] = useState(getPage(paramsId))
  const [deck, setDeck] = useState(getDeck(page))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [output, setOutput] = useState('')
  const [scores, setScores] = useState([])
  const gameOver = currentQuestion >= deck.length

  useEffect(() => {
    if (page >= 4 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const onSubmit = (evt) => {
    const guess = evt.target.value

    const question = deck[currentQuestion].question.replaceAll('???', guess)
    const result = eval(question)
    if (result) {
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
      if (currentQuestion + 1 === deck.length) {
        setOutput(`Game Over. <br> Score ${countOccurances()} / ${deck.length}`)
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
      {paramsId && (
        <TextLink
          to='/games/ccc'
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
            Deck {page}
          </Typography>
          <ScoreCircles length={deck.length} scores={scores} />
        </div>
        <Screen output={output} code={deck[currentQuestion].question} />

        <div className='true-or-false-radio'>
          <Button disabled={currentQuestion == 0} onClick={goBack}>
            Go Back
          </Button>
          {gameOver ? (
            <Box>
              <ToggleButtonGroup exclusive size='small'>
                <ToggleButton onClick={newGame}>Play Again</ToggleButton>
                {!displayName && page >= 4 ? (
                  <ToggleButton
                    variant='outlined'
                    disabled={page >= questions.length - 1}
                    onClick={() => {
                      let newNumber = page + 1
                      setPage(page)
                      setDeck(questions[page])
                      newGame()
                      navigate(`/new-member`)
                    }}
                  >
                    Become a Member
                  </ToggleButton>
                ) : (
                  <ToggleButton
                    variant='outlined'
                    disabled={number >= questions.length - 1}
                    onClick={() => {
                      let newPage = page + 1
                      setPage(newPage)
                      setDeck(questions[newPage])
                      newGame()
                      navigate(`/games/will-it-throw/${newPage + 1}`)
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
                disabled={output}
                size='small'
                sx={{
                  display: gameOver ? 'none' : 'inherit',
                }}
              >
                <ToggleButton value={'>'}>&nbsp; &gt; &nbsp;</ToggleButton>
                <ToggleButton value={'<'}>&nbsp; &lt; &nbsp;</ToggleButton>
                <ToggleButton value={'=='}>&nbsp; == &nbsp;</ToggleButton>
                <ToggleButton value={'==='}>&nbsp; === &nbsp;</ToggleButton>
                {/* {deck?.allowNots[currentQuestion] && (
                  <ToggleButton value={'!='}>&nbsp; != &nbsp;</ToggleButton>
                )}
                {deck?.allowNots[currentQuestion] && (
                  <ToggleButton value={'!=='}>&nbsp; !== &nbsp;</ToggleButton>
                )} */}
              </ToggleButtonGroup>
            </div>
          )}
        </div>
      </div>
      {/* {!gameOver && <Explanation text={deck?.explanations[currentQuestion]} />} */}
    </>
  )
}

export default Ccc
