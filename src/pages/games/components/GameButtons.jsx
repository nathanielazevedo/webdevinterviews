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
        <ToggleButton value={'1'}>True</ToggleButton>
        <ToggleButton value={'0'}>False</ToggleButton>
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
        <ToggleButton value={'yes'}>Yes</ToggleButton>
        <ToggleButton value={'no'}>No</ToggleButton>
      </ToggleButtonGroup>
    )
  }
  return <Box>{buttons}</Box>
}

export default GameButtons
