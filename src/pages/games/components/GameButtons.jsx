import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material'

const GameButtons = ({ onSubmit, disabled, gameName }) => {
  let buttons
  if (gameName == 'true-or-false') {
    buttons = (
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        size='small'
        disabled={disabled}
      >
        <ToggleButton value={'1'} sx={{ padding: '8px 20px' }}>
          True
        </ToggleButton>
        <ToggleButton value={'0'} sx={{ padding: '8px 20px' }}>
          False
        </ToggleButton>
      </ToggleButtonGroup>
    )
  } else if (gameName == 'will-it-throw') {
    buttons = (
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        size='small'
        disabled={disabled}
      >
        <ToggleButton value={'yes'} sx={{ padding: '8px 20px' }}>
          Yes
        </ToggleButton>
        <ToggleButton value={'no'} sx={{ padding: '8px 20px' }}>
          No
        </ToggleButton>
      </ToggleButtonGroup>
    )
  }
  return <Box>{buttons}</Box>
}

export default GameButtons
