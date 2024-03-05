import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material'

const GameButtons = ({ onSubmit, disabled, gameName, allowNots }) => {
  console.log(allowNots)
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
  } else if (gameName == 'ccc') {
    buttons = (
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        disabled={disabled}
        size='small'
      >
        <ToggleButton value={'>'} sx={{ padding: '8px 10px' }}>
          &nbsp; &gt; &nbsp;
        </ToggleButton>
        <ToggleButton value={'<'} sx={{ padding: '8px 10px' }}>
          &nbsp; &lt; &nbsp;
        </ToggleButton>
        <ToggleButton value={'=='} sx={{ padding: '8px 10px' }}>
          &nbsp; == &nbsp;
        </ToggleButton>
        <ToggleButton value={'==='} sx={{ padding: '8px 10px' }}>
          &nbsp; === &nbsp;
        </ToggleButton>
        {allowNots && (
          <ToggleButton value={'!='} sx={{ padding: '8px 10px' }}>
            &nbsp; != &nbsp;
          </ToggleButton>
        )}
        {allowNots && (
          <ToggleButton value={'!=='} sx={{ padding: '8px 10px' }}>
            &nbsp; !== &nbsp;
          </ToggleButton>
        )}
      </ToggleButtonGroup>
    )
  }
  return <Box>{buttons}</Box>
}

export default GameButtons
