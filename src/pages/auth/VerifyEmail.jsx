import { useContext, useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { AuthContext } from '../AuthContext'
import { useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Typography from '@mui/material/Typography'
import { NavLink } from 'react-router-dom'
import ResendVerificationDialog from './dialogs/ResendVerificationDialog'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  code: yup.string().required(),
})

const VerifyEmail = () => {
  const location = useLocation()
  const email = location?.state?.email
  const navigate = useNavigate()
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputEmail, setInputEmail] = useState('')
  const [resendVerificationCodeOpen, setResendVerificationCodeOpen] =
    useState(false)

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
      await handleVerifyEmail(data.email, data.code)
      navigate('/auth/login', { state: { email: data.email } })
    } catch (err) {
      setGeneralError(err.message)
    }
    setLoading(false)
  }

  const { handleVerifyEmail } = useContext(AuthContext)

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <Typography variant='h4'>Verify Email</Typography>
          <Box m={'10px 0px'}>
            <Typography variant='body1' color={'grey'} mt={'5px'}>
              Thanks for Signing Up,
            </Typography>
            <Typography variant='body1' color={'grey'} mt={'5px'}>
              We sent a code to your email. Input it here to verify your email
              address.
            </Typography>
          </Box>
          <Controller
            name='email'
            control={control}
            defaultValue={email || ''}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                id='email'
                label='Email'
                variant='outlined'
                onChange={(e) => {
                  field.onChange(e)
                  setInputEmail(e.target.value)
                }}
              />
            )}
          />
          <Controller
            name='code'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.code}
                helperText={errors.code?.message}
                id='code'
                label='Verification Code'
                variant='outlined'
              />
            )}
          />
          {generalError && (
            <Typography
              component='div'
              sx={{
                fontSize: '14px',
                color: 'red',
              }}
            >
              {generalError}
            </Typography>
          )}
          <Button type='submit' variant='contained' disabled={loading}>
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary',
                }}
              />
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        <Typography
          component='div'
          onClick={() => setResendVerificationCodeOpen(true)}
          sx={{
            fontSize: '14px',
            marginTop: '10px',
            color: resendVerificationCodeOpen ? 'primary.main' : 'grey',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Resend Verification Code
        </Typography>

        <NavLink
          to='/auth/login'
          className={({ isActive, isPending }) =>
            isActive ? 'active' : isPending ? 'pending' : 'not-active'
          }
          style={{ marginTop: '10px' }}
        >
          <Typography
            component='div'
            sx={{
              fontSize: '14px',
              marginTop: '2px',
            }}
          >
            Login
          </Typography>
        </NavLink>
      </Box>
      <ResendVerificationDialog
        open={resendVerificationCodeOpen}
        handleClose={() => setResendVerificationCodeOpen(false)}
        email={inputEmail}
      />
    </Box>
  )
}

export default VerifyEmail
