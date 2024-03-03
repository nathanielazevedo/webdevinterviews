import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthContext'
import TextLink from '../../../components/TextLink'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Game from '../components/Game'
import getProperDecks from './getProperDecks'

const GameBase = ({ gameName, random }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { displayName } = useContext(AuthContext)

  const decks = getProperDecks(gameName, random)
  const { deckNumber } = useParams()
  const [deck, setDeck] = useState(decks[Number(deckNumber) - 1])
  const isLastDeck = deckNumber >= decks.length - 1

  useEffect(() => {
    if (Number(deckNumber) >= 4 && !displayName) {
      navigate('/new-member')
    }
  }, [displayName])

  const goNextDeck = () => {
    const nextDeckNumber = Number(deckNumber) + 1
    const newPath = [...pathname.split('/').slice(0, -1), nextDeckNumber]

    setDeck(decks[nextDeckNumber - 1])
    navigate(newPath.join('/'))
  }

  return (
    <div className='fit-wrapper' key={deckNumber}>
      <TextLink
        to={`/games/${gameName}`}
        text='Back to decks'
        icon={<ArrowBackIosIcon fontSize='5px' />}
      />
      <Game
        deck={deck}
        isLastDeck={isLastDeck}
        goNextDeck={goNextDeck}
        gameName={gameName}
        showMemberButton={deckNumber >= 4 && !displayName}
      />
    </div>
  )
}

export default GameBase
