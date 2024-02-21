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
import { useLocation, NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  verificationCode: yup.string().required('Verification code is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

const ResetPassword = () => {
  const { handleResetPassword } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const email = location?.state?.email
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await handleResetPassword(
        data.email,
        data.verificationCode,
        data.newPassword
      )
    } catch (err) {
      console.log(err)
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
        <h1>Reset Password</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            height: '100%',
          }}
        >
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
            name='verificationCode'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                label='Verification Code'
                fullWidth
                error={!!errors.verificationCode}
                helperText={errors?.verificationCode?.message}
              />
            )}
          />
          <Controller
            name='newPassword'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                type='password'
                label='New Password'
                fullWidth
                error={!!errors.newPassword}
                helperText={errors?.newPassword?.message}
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
                type='password'
                label='Confirm New Password'
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message}
              />
            )}
          />
          <Box sx={{ mt: 2 }}>
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
                'Reset Password'
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

export default ResetPassword
