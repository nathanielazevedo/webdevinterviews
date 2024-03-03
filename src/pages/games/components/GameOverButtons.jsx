import React from 'react'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'

const GameOverButtons = ({
  newGame,
  pastFreeDecks,
  goNextDeck,
  isLastDeck,
}) => {
  return (
    <Box>
      <ToggleButtonGroup value={''} exclusive size='small'>
        <ToggleButton onClick={newGame} value=''>
          Play Again
        </ToggleButton>
        {pastFreeDecks ? (
          <ToggleButton
            variant='outlined'
            value={''}
            onClick={() => {
              // navigate(`/new-member`)
            }}
          >
            Become a Member
          </ToggleButton>
        ) : (
          <ToggleButton
            variant='outlined'
            value={''}
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
