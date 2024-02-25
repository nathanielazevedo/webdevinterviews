import { useState, useContext } from 'react'
import useApi from '../hooks/useApi'
import {
  FormControl,
  FormLabel,
  InputLabel,
  TextField,
  Typography,
  Button,
  Link,
  FormGroup,
  Divider,
  CircularProgress,
} from '@mui/material'
import Footer from '../components/Footer'
import displayNameImage from '../assets/display_name.png'
import accessCode from '../assets/access_code.png'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const NewMemberForm = () => {
  const [display_name, setDisplayName] = useState('')
  const [access_code, setAccessCode] = useState('')
  const [submitError, setSubmitError] = useState('')
  const { postIt } = useApi()
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setDisplayName: setContext } = useContext(AuthContext)

  const verifyName = async () => {
    setSubmitError('')
    if (!display_name) {
      setError({ display_name: 'Required.' })
      return
    }
    if (!access_code) {
      setError({ access_code: 'Required.' })
      return
    }
    setLoading(true)
    try {
      const response = await postIt('/verify-member', {
        display_name,
        access_code,
      })
      setContext(display_name)
      localStorage.setItem('access_token', response.data.access_token)
      navigate('/games')
    } catch {
      setSubmitError('Error verifying display name.')
    }
    setLoading(false)
  }

  return (
    <>
      <div className='fit-wrapper'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '20px',
          }}
        >
          <Typography variant='h4'>Become a member!</Typography>
          <Typography variant='subtitle1' color='grey.400'>
            If you want full access to games and workouts please become a member
            of my YouTube channel. It's my way of thanking my supporters. 99
            cents a month.
          </Typography>
          <Link
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
            target='_blank'
          >
            Become a member
          </Link>
        </div>
        <Divider />
        <FormControl>
          <FormGroup sx={{ gap: '20px', marginTop: '20px' }}>
            <Typography variant='h4'>Already a member?</Typography>
            <TextField
              label='YouTube Display Name'
              variant='outlined'
              value={display_name}
              error={error?.display_name}
              helperText={
                error?.access_code
                  ? 'Required.'
                  : 'Enter your display name. Look at the first picture on this page for help. It is case sensitive.'
              }
              onChange={(evt) => {
                setError(null)
                setDisplayName(evt.target.value)
              }}
            />

            <TextField
              label='Access Code'
              variant='outlined'
              value={access_code}
              error={error?.access_code}
              helperText={
                error?.access_code
                  ? 'Required.'
                  : 'Find this in the YouTube channel membership tab. Scroll to bottom. Read the first post. Still need help? Look at the last picture of this page.'
              }
              onChange={(evt) => {
                setError(null)
                setAccessCode(evt.target.value)
              }}
            />
          </FormGroup>
        </FormControl>
        <Button variant='contained' onClick={verifyName} disabled={loading}>
          {loading ? (
            <CircularProgress
              sx={{
                color: 'colors.primary',
              }}
            />
          ) : (
            'Submit'
          )}
        </Button>
        {submitError && (
          <Typography color='error'>
            Could not verify membership. Access code incorrect or member not
            found.
          </Typography>
        )}
        <Typography>
          By submitting this form you agree to our
          <Link
            target='_blank'
            sx={{ padding: '0 10px' }}
            href='https://app.termly.io/document/privacy-policy/6d782f95-1dec-49a3-aca0-17e628b85bc0'
          >
            Privacy Policy
          </Link>
          and
          <Link
            target='_blank'
            sx={{ padding: '0 10px' }}
            href='https://app.termly.io/document/terms-of-service/fc74560a-b49f-4bd6-9cfd-f230faa97b98'
          >
            Terms of Service
          </Link>
          .
        </Typography>
        <Divider sx={{ margin: '40px 0' }} />
        <Typography variant='h4'>How to find your display name:</Typography>
        <img src={displayNameImage} />
        <Typography variant='h4'>How to find the access code:</Typography>
        <img src={accessCode} />
      </div>
      <Footer />
    </>
  )
}

export default NewMemberForm
