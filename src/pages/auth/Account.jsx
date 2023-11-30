import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteAccountDialog from './dialogs/DeleteAccountDialog'
import CircularProgress from '@mui/material/CircularProgress'

const Account = () => {
  const { user, handleLogout, handleDeleteAccount } = useContext(AuthContext)
  const [attributes, setAttributes] = useState({})
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogoutClick = async () => {
    setLoadingLogout(true)
    try {
      await handleLogout()
      navigate('/auth/login')
    } catch (err) {
      console.error(err)
    }
    setLoadingLogout(false)
  }

  const handleDelete = () => {
    try {
      handleDeleteAccount()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) {
      user.getUserAttributes((err, attributes) => {
        if (err) {
          console.error(err)
          return
        }

        const attrs = {}

        for (let attribute of attributes) {
          const { Name, Value } = attribute
          attrs[Name] = Value
        }

        setAttributes(attrs)
      })
    } else {
      navigate('/auth/login')
    }
  }, [navigate, user])

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 3,
          ml: 3,
          width: '50%',
        }}
      >
        <Typography variant='h5' component='div' sx={{ mt: 2 }}>
          Account Information
        </Typography>
        <Box sx={{ mt: 2, p: 0, width: '100%' }}>
          <Typography variant='body2'>
            <strong style={{ color: 'grey' }}>Username:</strong>
            {attributes.nickname}
          </Typography>
          <Typography variant='body2'>
            <strong style={{ color: 'grey' }}>Email:</strong> {attributes.email}
          </Typography>
        </Box>
        <Button
          variant='contained'
          color='primary'
          disabled={loadingLogout}
          onClick={handleLogoutClick}
          sx={{ mt: 2, width: '200px' }}
        >
          {loadingLogout ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary',
              }}
            />
          ) : (
            'Log Out'
          )}
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={handleClickOpen}
          sx={{ mt: 2, width: '200px' }}
        >
          Delete Account
        </Button>
      </Box>
      <DeleteAccountDialog
        handleClose={handleClose}
        setOpen={setOpen}
        open={open}
        handleDelete={handleDelete}
      />
    </Container>
  )
}

export default Account
