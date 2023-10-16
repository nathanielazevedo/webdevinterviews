/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export default function AlertDialog({ onLeave, setOpen }) {
  const handleCloseDeny = () => setOpen(false)

  return (
    <Dialog
      open
      onClose={handleCloseDeny}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'Yo... Are you sure?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          You've got unsaved changes. Are you sure you want to leave?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeny}>Cancel</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button color='error' onClick={onLeave}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  )
}
