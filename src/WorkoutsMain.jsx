import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid from './Grid'
import { Avatar } from '@mui/material'
import react from './assets/react-2.svg'
import { useState } from 'react'

export default function BasicChips() {
  const [chip, setChip] = useState('all')

  const handleClick = (value) => {
    setChip(value)
  }

  return (
    <>
      <Stack direction='row' spacing={1} mb={3}>
        <Chip
          label='All'
          onClick={() => handleClick('all')}
          variant={chip === 'all' ? 'filled' : 'outlined'}
        />
        <Chip
          label='React'
          avatar={<Avatar alt='R' src={react} />}
          onClick={() => handleClick('react')}
          variant={chip === 'react' ? 'filled' : 'outlined'}
        />
      </Stack>
      <Grid />
    </>
  )
}
