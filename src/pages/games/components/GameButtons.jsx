import { Box, ToggleButtonGroup, ToggleButton, Button } from '@mui/material'

const GameButtons = ({ onSubmit, disabled, gameName, allowNots, options }) => {
  let buttons
  if (gameName == 'true-or-false') {
    buttons = (
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        size='small'
        disabled={disabled}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          width: '100%',
          flexGrow: 1,
        }}
      >
        <ToggleButton value={'1'} sx={{ padding: '8px 20px' }}>
          True
        </ToggleButton>
        <ToggleButton value={'0'} sx={{ padding: '8px 20px' }}>
          False
        </ToggleButton>
      </ToggleButtonGroup>
    )
  } else if (gameName == 'will-it-throw' || gameName == 'mutate') {
    buttons = (
      <ToggleButtonGroup
        exclusive
        onChange={onSubmit}
        size='small'
        disabled={disabled}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          width: '100%',
          flexGrow: 1,
        }}
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
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          width: '100%',
          flexGrow: 1,
        }}
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
  } else if (gameName == 'returns') {
    buttons = (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          minWidth: '100%',
          flexGrow: 1,
        }}
      >
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              variant='outlined'
              onClick={onSubmit}
              value={index}
              size='small'
              sx={{
                padding: '10px 20px',
                color: 'grey.500',
                outlineColor: 'grey.500',
                borderColor: 'grey.700',
                margin: '5px 0',
              }}
            >
              {option}
            </Button>
          )
        })}
      </div>
    )
  }
  return <Box width={'100%'}>{buttons}</Box>
}

export default GameButtons
