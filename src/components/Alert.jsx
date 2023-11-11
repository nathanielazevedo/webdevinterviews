/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { useNavigate } from 'react-router-dom'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export default function AlertDialog({ setOpen, workout }) {
  const navigate = useNavigate()

  const handleCloseDeny = () => setOpen(false)

  const handleCloseAgree = () => {
    setOpen(false)
    localStorage.removeItem(workout.name)
    navigate(`/workouts/react/${workout.name}/files`)
  }

  return (
    <Dialog
      open
      onClose={handleCloseDeny}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'Are you sure?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          This will reset your code to the original template. <br /> Anything
          you've written will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeny}>Cancel</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button color='error' onClick={handleCloseAgree}>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  )
}
