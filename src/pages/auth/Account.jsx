import { useContext, useState } from 'react'
import { Container, Typography, Button, Box, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { AuthContext } from '../../contexts/AuthContext'
import DeleteAccountDialog from './dialogs/DeleteAccountDialog'

const Account = () => {
  const { user, handleLogout, handleDeleteAccount, authLoading } =
    useContext(AuthContext)
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

  if (authLoading) {
    return (
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
              width: '500px',
            }}
          >
            <Skeleton variant='circular' width='80px' height='80px' />
            <Box sx={{ width: '150px' }}>
              <Skeleton variant='text' />
              <Skeleton variant='text' />
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  if (!authLoading && !user) {
    navigate('/auth/login')
  }

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
              <Typography variant='body2'>{user.username}</Typography>
              <Typography variant='body2'>{user.email}</Typography>
            </Box>
          </Box>
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
