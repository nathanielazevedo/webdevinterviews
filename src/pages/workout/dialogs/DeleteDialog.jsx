import PropTypes from 'prop-types'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'
import api from '../../../api'
import { useNavigate } from 'react-router-dom'
import WorkoutContext from '../WorkoutContext'
import { useContext } from 'react'

const DeleteDialog = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const { workout } = useContext(WorkoutContext)
  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    try {
      await api.delete(`/workouts/${workout.id}`)
      navigate('/workouts')
      setOpen(false)
    } catch (error) {
      console.error(`Failed to delete workout: ${error.message}`)
      // Handle the error here, e.g., by showing an error message to the user
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
