/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import cognito from '../aws-config'

const AuthDialog = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isVerification, setIsVerification] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  const handleSignup = () => {
    const params = {
      ClientId: '77pkpp73fkpm1h4r586knd48vm',
      Password: password,
      Username: email,
      UserAttributes: [
        {
          Name: 'nickname',
          Value: username,
        },
      ],
    }

    cognito.signUp(params, (err, data) => {
      if (err) {
        console.error('Error signing up:', err)
      } else {
        console.log('User signed up successfully:', data)
        setIsVerification(true)
      }
    })
  }

  const handleVerification = () => {
    // handle verification here
    const params = {
      ClientId: '77pkpp73fkpm1h4r586knd48vm',
      ConfirmationCode: verificationCode, // The verification code sent to the user
      Username: email, // The email or username of the user
    }
    cognito.confirmSignUp(params, (err, data) => {
      if (err) {
        console.error('Error confirming sign-up:', err)
      } else {
        console.log('User confirmed successfully:', data)
      }
    })
  }

  const handleLogin = () => {
    // handle login here
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
      <DialogContent>
        {isVerification ? (
          <form onSubmit={handleVerification}>
            <TextField
              margin='dense'
              id='verificationCode'
              label='Verification Code'
              type='text'
              fullWidth
              variant='standard'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleVerification}
            >
              Verify
            </Button>
          </form>
        ) : (
          <form>
            {!isLogin && (
              <TextField
                margin='dense'
                id='username'
                label='username'
                type='text'
                fullWidth
                variant='standard'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <TextField
              margin='dense'
              id='email'
              label='Email Address'
              type='email'
              fullWidth
              variant='standard'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin='dense'
              id='password'
              label='Password'
              type='password'
              fullWidth
              variant='standard'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={isLogin ? handleLogin : handleSignup}
                variant='contained'
                color='primary'
                fullWidth
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant='body2' align='center'>
                {isLogin ? 'New to us?' : 'Already have an account?'}
                <Button color='primary' onClick={toggleForm}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </Button>
              </Typography>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthDialog
