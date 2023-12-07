import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useNavigate } from 'react-router-dom'

const RateLimitPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px',
      }}
    >
      <ErrorOutlineIcon color='error' style={{ fontSize: 60 }} />
      <Typography variant='h4' color='error'>
        You have been rate limited
      </Typography>
      <Typography variant='h6'>
        Sign up or login to remove rate limiting
      </Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </Button>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    </Box>
  )
}

export default RateLimitPage
