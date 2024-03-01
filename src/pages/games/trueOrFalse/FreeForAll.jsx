import decks from './freeForAll.json'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Deck from '../components/Deck'

const FreeForAll = ({ displayName }) => {
  const navigate = useNavigate()
  decks.forEach((deck) => {
    if (displayName) {
      deck.public = true
    }
  })
  return (
    <>
      <Typography sx={{ color: 'grey.500' }}>
        You will receive random questions in no logical order. It's best to do
        this after completing the structured path.
      </Typography>
      <div style={{ margin: '20px 0' }}>
        {decks.map((deck, index) => {
          return (
            <Deck
              key={index}
              deck={deck}
              to={`/games/true-or-false/${deck.to}/random`}
            />
          )
        })}
      </div>
    </>
  )
}

export default FreeForAll
