import { Box, Typography } from '@mui/material'
import { useRouteError } from 'react-router-dom'
import Donkey from '../assets/donkey-brains.png'

const Error = () => {
  const error = useRouteError()
  return (
    <Box
      sx={{
        padding: '50px',
        display: 'flex',
      }}
    >
      <img src={Donkey} alt='donkey' width={'300px'} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '50px',
        }}
      >
        <Typography variant='h4' color={'red'}>
          Error
        </Typography>
        <Typography variant='h5'>
          Error Message:{' '}
          <span
            style={{
              color: 'red',
            }}
          >
            {error.statusText || error.message}
          </span>
        </Typography>
        <Typography variant='h5'>Does this keep happening?</Typography>
        <Typography variant='h5'>Some options:</Typography>
        <Typography variant='h5'>message me on LinkedIn</Typography>
        <Typography variant='h5'>clear local storage</Typography>
      </Box>
    </Box>
  )
}

export default Error
