/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from '@mui/material'
import logo from './assets/logo.png'

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '50px',
      }}
    >
      <div
        style={{
          // border: 'solid green 1px',
          backgroundImage: `url(${logo})`,
          height: '340px',
          width: '600px',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      ></div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h2'>Let's get started.</Typography>
        <Typography variant='h5'>
          I intend to provide you with quality content.
        </Typography>
      </Box>
    </Box>
  )
}

export default Home
