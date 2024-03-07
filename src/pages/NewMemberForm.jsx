import { useState, useContext } from 'react'
import useApi from '../hooks/useApi'
import {
  FormControl,
  TextField,
  Typography,
  Button,
  Link,
  FormGroup,
  Divider,
  CircularProgress,
} from '@mui/material'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Faq from '../components/Faq'
import HomeHeader from './home/components/HomeHeader'
import HomeButton from './home/components/HomeButton'

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
        <div className='big-spacer'>
          <div className='marketing-section'>
            <HomeHeader
              title={'BECOME A MEMBER'}
              subtext={
                'Members of my YouTube channel get all access to workouts, True or False, and Will It Throw games. It costs 99 cents a month. Your support allows me to improve my content and continue to produce cool stuff.'
              }
            />
            <HomeButton
              text='Become a member'
              to='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
              outside={true}
              oneLine={true}
            />
          </div>
          <Divider />
          <div className='marketing-section'>
            <FormControl>
              <FormGroup sx={{ gap: '20px' }}>
                <HomeHeader title={'ALREADY A MEMBER?'} />
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
      </div>
      <Footer />
    </>
  )
}

export default NewMemberForm
