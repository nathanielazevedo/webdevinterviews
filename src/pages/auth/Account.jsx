import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const Account = () => {
  const { user, handleLogout, handleDeleteAccount } = useContext(AuthContext)
  const [attributes, setAttributes] = useState({})
  const navigate = useNavigate()
  console.log('wow')
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    // Delete account logic here
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
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Avatar sx={{ width: 56, height: 56 }}>U</Avatar>
        <Typography variant='h4' component='div' sx={{ mt: 2 }}>
          Account Information
        </Typography>
        <Paper sx={{ mt: 2, p: 2, width: '100%' }}>
          <Typography variant='body1'>
            <strong>Username:</strong> {attributes.nickname}
          </Typography>
          <Typography variant='body1'>
            <strong>Email:</strong> {attributes.email}
          </Typography>
          <Typography variant='body1'>
            <strong>Verified:</strong> {attributes.email_verified}
          </Typography>
        </Paper>
        <Button
          variant='contained'
          color='primary'
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
      <Button variant='contained' color='secondary' onClick={handleClickOpen}>
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Account
