/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'

const DeleteAccount = ({ handleClose, setOpen, open }) => {
  const { handleDeleteAccount } = useContext(AuthContext)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleDelete = async () => {
    setLoadingDelete(true)
    try {
      await handleDeleteAccount()
    } catch (err) {
      console.error(err)
    }
    setLoadingDelete(false)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
        }}
      >
        Delete Your Account
        <IconButton
          edge='end'
          color='inherit'
          onClick={() => setOpen(false)}
          aria-label='close'
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px 20px 20px',
        }}
      >
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color='error'
          variant='contained'
          disabled={loadingDelete}
        >
          {loadingDelete ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'error',
              }}
            />
          ) : (
            'Delete Account'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteAccount
