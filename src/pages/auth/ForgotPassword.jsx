import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Typography } from '@mui/material'
import { AuthContext } from '../AuthContext'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
})

const ForgotPassword = () => {
  const { handleForgotPassword } = useContext(AuthContext)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    // Handle form submission
    try {
      handleForgotPassword(data.email)
    } catch (err) {
      console.log(err)
    }
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
          <Box sx={{ mt: 2, mb: '5px' }}>
            <Button type='submit' variant='contained' color='primary' fullWidth>
              Submit
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
