import decks from './structured.json'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Deck from '../components/Deck'

const Structured = ({ displayName }) => {
  const navigate = useNavigate()
  decks.forEach((deck) => {
    if (displayName) {
      deck.public = true
    }
  })
  return (
    <>
      <Typography sx={{ color: 'grey.500' }}>
        This is the structured path. This series of questions will slowly
        introduce you to the different JavaScript types and how they behave.
        Each series of questions builds upon the previous questions. This is a
        great place to start.
      </Typography>
      <div style={{ margin: '20px 0' }}>
        {decks.map((deck, index) => {
          return (
            <Deck
              key={index}
              deck={deck}
              to={`/games/true-or-false/${deck.to}`}
            />
          )
        })}
      </div>
    </>
  )
}

export default Structured
