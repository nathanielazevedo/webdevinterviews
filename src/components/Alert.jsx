/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { WorkoutContext } from '../workouts/Workout'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export default function AlertDialog({ setOpen }) {
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)

  const handleCloseDeny = () => setOpen(false)

  const handleCloseAgree = () => {
    setOpen(false)
    localStorage.removeItem(workoutState.challenge.name)
    setWorkoutState((prevState) => ({
      ...prevState,
    }))
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
