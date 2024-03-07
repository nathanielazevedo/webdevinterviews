import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const GameOverButtons = ({
  newGame,
  pastFreeDecks,
  goNextDeck,
  isLastDeck,
}) => {
  const navigate = useNavigate()
  return (
    <ToggleButtonGroup
      value={''}
      exclusive
      size='small'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        width: '100%',
        flexGrow: 1,
      }}
    >
      <ToggleButton onClick={newGame} value={'play'}>
        Play Again
      </ToggleButton>
      {pastFreeDecks ? (
        <ToggleButton
          variant='outlined'
          value={'become'}
          onClick={() => navigate(`/new-member`)}
        >
          Become a Member
        </ToggleButton>
      ) : (
        <ToggleButton
          variant='outlined'
          value={'all'}
          disabled={isLastDeck}
          onClick={goNextDeck}
        >
          {isLastDeck ? 'All done' : 'Next Deck'}
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  )
}

export default GameOverButtons
