import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { Container, Typography, Button, Box, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteAccountDialog from './dialogs/DeleteAccountDialog'
import { LogContext } from '../LogContext'
import CircularProgress from '@mui/material/CircularProgress'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

const Account = () => {
  const { user, handleLogout, handleDeleteAccount } = useContext(AuthContext)
  const [attributes, setAttributes] = useState(null)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const { addLog } = useContext(LogContext)

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
      // navigate('/auth/login')
      addLog({
        method: 'error',
        data: ['Error fetching account info.'],
      })
    }
  }, [navigate, user])

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: '20px',
          ml: '20px',
        }}
      >
        <Box sx={{ mt: '10px', width: '500px' }}>
          {attributes ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                width: '500px',
              }}
            >
              <AccountCircleOutlinedIcon
                sx={{
                  fontSize: '100px',
                  color: 'primary',
                }}
              />
              <Box>
                <Typography variant='body2'>{attributes.nickname}</Typography>
                <Typography variant='body2'>{attributes.email}</Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                width: '500px',
              }}
            >
              <Skeleton variant='circular' width={'80px'} height={'80px'} />
              <Box sx={{ width: '150px' }}>
                <Skeleton variant='text' />
                <Skeleton variant='text' />
              </Box>
            </Box>
          )}
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
