import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: '3rem',
        gap: '10px',
      }}
    >
      <Typography variant='h4'>401 Unauthorized</Typography>
      <Typography>
        Login or sign up to create your own coding challenges for the community
        to solve.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <Button onClick={() => navigate('/auth/login')} variant='contained'>
          Log in
        </Button>
        <Button onClick={() => navigate('/auth/signup')} variant='contained'>
          Sign up
        </Button>
      </Box>
    </Box>
  )
}

export default Unauthorized
