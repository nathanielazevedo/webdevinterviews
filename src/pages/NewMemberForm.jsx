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
import Faq from '../components/Faq'

const NewMemberForm = () => {
  const [display_name, setDisplayName] = useState('')
  // const [access_code, setAccessCode] = useState('webdev5')
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
    // if (!access_code) {
    //   setError({ access_code: 'Required.' })
    //   return
    // }
    setLoading(true)
    try {
      const response = await postIt('/verify-member', {
        display_name,
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
        <div className='marketing-section'>
          <Typography variant='h3' color='grey.500'>
            BECOME A MEMBER
          </Typography>
          <Typography variant='h6' color='grey.300'>
            Members of my YouTube channel get all access to workouts, True or
            False, and Will It Throw games. It costs 99 cents a month. Your
            support allows me to improve my content and continue to produce cool
            stuff.
          </Typography>
          <Button
            variant='outlined'
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
            target='_blank'
            size='large'
            sx={{
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className='marketing-button'
          >
            Become a member
          </Button>
        </div>
        <Divider />
        <div className='marketing-section'>
          <FormControl>
            <FormGroup sx={{ gap: '20px' }}>
              <Typography variant='h3' color='grey.500'>
                ALREADY A MEMBER?
              </Typography>
              <TextField
                label='YouTube Display Name'
                variant='outlined'
                value={display_name}
                error={error?.display_name}
                helperText={
                  error?.access_code
                    ? 'Required.'
                    : 'Enter your YouTube display name. It is case sensitive. Scroll to the bottom of this page for help.'
                }
                onChange={(evt) => {
                  setError(null)
                  setDisplayName(evt.target.value)
                }}
              />

              {/* <TextField
                label='Access Code'
                variant='outlined'
                value={access_code}
                error={error?.access_code}
                helperText={
                  error?.access_code
                    ? 'Required.'
                    : 'Find this in the YouTube channel membership tab. Scroll to bottom. Read the first post. Scroll to the bottom of this page for help.'
                }
                onChange={(evt) => {
                  setError(null)
                  setAccessCode(evt.target.value)
                }}
              /> */}
              <Button
                variant='outlined'
                onClick={verifyName}
                disabled={loading}
                size='large'
                sx={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
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
                  Could not verify membership. Member not found.
                </Typography>
              )}
            </FormGroup>
          </FormControl>
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
        </div>
        <Divider sx={{ margin: '40px 0' }} />
        <Faq />
      </div>
      <Footer />
    </>
  )
}

export default NewMemberForm
