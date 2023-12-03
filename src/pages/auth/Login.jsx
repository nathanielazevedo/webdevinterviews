/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography } from '@mui/material'
import { AuthContext } from '../../pages/AuthContext'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'
import { LogContext } from '../LogContext'
import CircularProgress from '@mui/material/CircularProgress'
import { useLocation } from 'react-router-dom'
import Fade from '@mui/material/Fade'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location?.state?.email
  const [generalError, setGeneralError] = useState('')
  const { authenticated, handleLogin } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const { addLog } = useContext(LogContext)
  const [loading, setLoading] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    if (authenticated) {
      navigate('/auth/account')
    }
  }, [authenticated, navigate])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await handleLogin(data.email, data.password)
      addLog({
        method: 'log',
        data: ['Logged in.'],
      })
    } catch (err) {
      if (err.code === 'NotAuthorizedException') {
        setGeneralError('Incorrect username or password. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <Fade in={true} timeout={1000}>
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
          <form>
            <h1>Login</h1>
            <Controller
              name='email'
              control={control}
              defaultValue={email || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='dense'
                  id='email'
                  label='Email Address'
                  type='email'
                  fullWidth
                  variant='outlined'
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='dense'
                  id='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant='outlined'
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {generalError && (
              <Typography variant='body2' color='error'>
                {generalError}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant='contained'
                disabled={loading}
                fullWidth
                sx={{
                  marginBottom: '5px',
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'primary',
                    }}
                  />
                ) : (
                  'Log In'
                )}
              </Button>
            </Box>
            <NavLink
              to='/auth/forgot-password'
              className={({ isActive, isPending }) =>
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '14px',
                }}
              >
                Forgot Password?
              </Typography>
            </NavLink>
            <NavLink
              to='/auth/verify-email'
              className={({ isActive, isPending }) =>
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '14px',
                }}
              >
                Verify email address
              </Typography>
            </NavLink>

            <Box sx={{ mt: 2 }}>
              <Typography variant='body2' align='center'>
                New to us?
                <NavLink
                  to='/auth/signup'
                  className={({ isActive, isPending }) =>
                    isActive ? 'active' : isPending ? 'pending' : 'not-active'
                  }
                >
                  <Typography
                    component='div'
                    sx={{
                      fontSize: '14px',
                    }}
                  >
                    Sign Up
                  </Typography>
                </NavLink>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Fade>
  )
}

export default Login
