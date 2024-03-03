import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthContext'
import TextLink from '../../../components/TextLink'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Game from '../components/Game'

import structuredDecks from './data/structured.json'
import randomDecks from './data/random.json'

const TrueOrFalse = ({ random }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { displayName } = useContext(AuthContext)

  const decks = random ? randomDecks : structuredDecks
  const { deckNumber } = useParams()
  const [deck, setDeck] = useState(decks[Number(deckNumber) - 1])
  const lastDeck = deckNumber >= decks.length - 1

  useEffect(() => {
    if (Number(deckNumber) >= 4 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const nextDeck = () => {
    const nextDeckNumber = Number(deckNumber) + 1
    const newPath = pathname.split('/')
    newPath.pop()
    newPath.push(nextDeckNumber)
    setDeck(decks[nextDeckNumber - 1])
    navigate(newPath.join('/'))
  }

  return (
    <div className='fit-wrapper' key={deckNumber}>
      <TextLink
        to='/games/true-or-false'
        text='Back to decks'
        icon={<ArrowBackIosIcon fontSize='5px' />}
      />
      <Game
        deck={deck}
        lastDeck={lastDeck}
        nextDeck={nextDeck}
        gameName={'true-or-false'}
        showMemberButton={deckNumber >= 4 && !displayName}
      />
    </div>
  )
}

export default TrueOrFalse
