import api from '../../../api'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import WorkoutContext from '../WorkoutContext'
import { LogContext } from '../../LogContext'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'

const DeleteDialog = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const { workout } = useContext(WorkoutContext)
  const { addLog } = useContext(LogContext)
  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    try {
      await api.delete(`/workouts/${workout.id}`)
      addLog(`Workout deleted.`)
      navigate('/workouts')
      setOpen(false)
    } catch (error) {
      console.error(`Failed to delete workout: ${error.message}`)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default DeleteDialog
