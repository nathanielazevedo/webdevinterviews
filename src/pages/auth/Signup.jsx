/* eslint-disable react/prop-types */
import { TextField, Button, Box, Typography } from '@mui/material'
import { useEffect, useContext, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import { AuthContext } from '../AuthContext'

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  username: yup
    .string('Enter your username')
    .min(2, 'Username should be of minimum 2 characters length')
    .required('Username is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Confirm your password')
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

const AuthDialog = () => {
  const navigate = useNavigate()
  const { authenticated, handleSignup } = useContext(AuthContext)
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await handleSignup(data.email, data.username, data.password)
    } catch (err) {
      if (err.code === 'UsernameExistsException') {
        setError('email', {
          type: 'manual',
          message: 'Email already exists',
        })
      } else if (err.code === 'InvalidPasswordException') {
        setError('password', {
          type: 'manual',
          message:
            'Password must be at least 8 characters, contain a number, an uppercase letter, and a special character.',
        })
      } else {
        setGeneralError('An error occurred while signing up. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <Fade in timeout={1000}>
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
            <h1>Signup</h1>
            <Controller
              name='username'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='dense'
                  id='username'
                  label='Username'
                  type='text'
                  fullWidth
                  variant='outlined'
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              defaultValue=''
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

            <Controller
              name='confirmPassword'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='dense'
                  id='confirmPassword'
                  label='Confirm Password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant='outlined'
                  error={!!errors.confirmPassword}
                  helperText={errors?.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                fullWidth
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'primary',
                    }}
                  />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </Box>
            {generalError && (
              <Box sx={{ mt: 2 }}>
                <Typography color='error'>{generalError}</Typography>
              </Box>
            )}
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant='body2' align='center'>
                Already have an account?
                <NavLink
                  to='/auth/login'
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
                    Login
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

export default AuthDialog
