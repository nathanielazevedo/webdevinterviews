import {
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'

const GameButtons = ({ onSubmit, disabled }) => {
  return (
    <Box>
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        size='small'
        disabled={disabled}
      >
        <ToggleButton value={'1'}>True</ToggleButton>
        <ToggleButton value={'0'}>False</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default GameButtons
