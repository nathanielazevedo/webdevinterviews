import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
})

const ForgotPassword = () => {
  const { handleForgotPassword } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    // Handle form submission
    setLoading(true)
    try {
      await handleForgotPassword(data.email)
      navigate('/auth/reset-password', { state: { email: data.email } })
    } catch (err) {
      setError(err)
    }
    setLoading(false)
  }

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
      <Box sx={{ width: '500px' }}>
        <h1>Forgot Password</h1>
        <Typography
          sx={{
            fontSize: '16px',
            color: 'gray',
            mb: '20px',
          }}
        >
          Enter your email address. We will email you a code.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                type='email'
                label='Email'
                fullWidth
                error={!!errors.email}
                helperText={errors?.email?.message}
              />
            )}
          />
          {error && (
            <Typography
              sx={{
                fontSize: '14px',
                color: 'red',
                mb: '20px',
              }}
            >
              {error.message}
            </Typography>
          )}
          <Box sx={{ mt: 2, mb: '5px' }}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary',
                  }}
                />
              ) : (
                'Send Code'
              )}
            </Button>
          </Box>
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
              Back to Login
            </Typography>
          </NavLink>
        </form>
      </Box>
    </Box>
  )
}

export default ForgotPassword
