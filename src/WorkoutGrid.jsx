import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid from './Grid'
import { Avatar } from '@mui/material'
import react from './assets/react-2.svg'

export default function BasicChips() {
  const handleClick = () => {
    console.log('clicked chip')
  }
  return (
    <>
      <Stack direction='row' spacing={1} mb={3}>
        <Chip label='All' onClick={handleClick} variant='outlined' />
        <Chip
          label='React'
          avatar={<Avatar alt='R' src={react} style={{ padding: '4px' }} />}
          onClick={handleClick}
        />
        <Chip label='JavaScript' variant='outlined' />
      </Stack>
      <Grid />
    </>
  )
}
