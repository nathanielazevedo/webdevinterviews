import { useState } from 'react'
import useApi from '../hooks/useApi'
import {
  FormControl,
  FormLabel,
  InputLabel,
  TextField,
  Typography,
  Button,
} from '@mui/material'
import Footer from '../components/Footer'

const NewMemberForm = () => {
  const [userName, setUserName] = useState('')
  const { postIt } = useApi()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const verifyName = async () => {
    if (!userName) {
      setError('Required.')
    }
    const response = await postIt('/verify-member', { userName })
  }

  return (
    <>
      <div className='fit-wrapper'>
        <Typography variant='h4' sx={{ marginTop: '30px' }}>
          Member Verification
        </Typography>
        <FormControl>
          <TextField
            label='Enter your YouTube display name.'
            variant='outlined'
            value={userName}
            error={error}
            helperText={'Required.'}
            onChange={(evt) => {
              setError(null)
              setUserName(evt.target.value)
            }}
          />
        </FormControl>
        <Button variant='outlined' onClick={verifyName}>
          Submit
        </Button>
      </div>
      <Footer />
    </>
  )
}

export default NewMemberForm
