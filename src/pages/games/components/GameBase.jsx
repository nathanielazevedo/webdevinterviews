import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthContext'
import TextLink from '../../../components/TextLink'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Game from '../components/Game'
import getProperDecks from './getProperDecks'
import getRandomQuestions from './getRandoms'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MusicOffIcon from '@mui/icons-material/MusicOff'
import { IconButton } from '@mui/material'

const GameBase = ({ gameName, random }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { displayName } = useContext(AuthContext)
  const [playSound, setPlaySound] = useState(localStorage.getItem('playSounds'))

  const decks = getProperDecks(gameName, random)
  const { deckNumber } = useParams()
  const [key, setKey] = useState(deckNumber)
  const [deck, setDeck] = useState(
    deckNumber == 'r'
      ? getRandomQuestions(decks)
      : decks[Number(deckNumber) - 1]
  )
  const isLastDeck = deckNumber >= decks.length - 1
  const pastFreeDecks = Number(deckNumber) >= 5 && !displayName

  useEffect(() => {
    if (Number(deckNumber) >= 6 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const goNextDeck = () => {
    if (deckNumber == 'r') {
      setDeck(getRandomQuestions(decks))
      setKey(key + 1)
      return
    }
    const nextDeckNumber = Number(deckNumber) + 1
    const newPath = [...pathname.split('/').slice(0, -1), nextDeckNumber]
    setKey(nextDeckNumber)
    setDeck(decks[nextDeckNumber - 1])
    navigate(newPath.join('/'))
  }

  const setSoundPreference = () => {
    localStorage.setItem('playSounds', !playSound)
    setPlaySound(!playSound)
  }

  return (
    <div className='fit-wrapper' key={key}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextLink
          to={`/games/${gameName}`}
          text='Back to decks'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <IconButton onClick={setSoundPreference}>
          {playSound ? (
            <MusicNoteIcon sx={{ color: 'grey.400' }} />
          ) : (
            <MusicOffIcon sx={{ color: 'grey.400' }} />
          )}
        </IconButton>
      </div>
      <Game
        deck={deck}
        isLastDeck={isLastDeck}
        goNextDeck={goNextDeck}
        playSound={playSound}
        gameName={gameName}
        pastFreeDecks={pastFreeDecks}
        showMemberButton={deckNumber >= 4 && !displayName}
      />
    </div>
  )
}

export default GameBase
