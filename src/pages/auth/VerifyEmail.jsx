import { useState, useContext } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { AuthContext } from '../AuthContext'
import { useLocation } from 'react-router-dom'

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  const { user, handleVerifyEmail } = useContext(AuthContext)
  console.log(user)
  const handleCodeChange = (event) => {
    setCode(event.target.value)
  }
  const location = useLocation()
  const { email } = location.state

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '500px',
        }}
      >
        <Typography variant='h4'>Verify Email</Typography>
        <TextField
          margin='dense'
          id='code'
          label='Verification Code'
          type='text'
          fullWidth
          variant='outlined'
          value={code}
          onChange={handleCodeChange}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant='contained'
            onClick={() => handleVerifyEmail(email, code)}
          >
            Verify
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default VerifyEmail
