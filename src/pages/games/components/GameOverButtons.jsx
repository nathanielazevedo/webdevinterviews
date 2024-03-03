import React from 'react'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const GameOverButtons = ({
  newGame,
  pastFreeDecks,
  goNextDeck,
  isLastDeck,
}) => {
  const navigate = useNavigate()
  return (
    <Box>
      <ToggleButtonGroup value={''} exclusive size='small'>
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
    </Box>
  )
}

export default GameOverButtons
