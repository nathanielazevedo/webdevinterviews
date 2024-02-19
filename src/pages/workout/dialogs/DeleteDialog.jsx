import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { WorkoutContext } from '../../../contexts/WorkoutContext'
import { AuthContext } from '../../AuthContext'

const DeleteDialog = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const { workoutData: workout } = useContext(WorkoutContext)
  const [loading, setLoading] = useState(false)
  const { API } = useContext(AuthContext)
  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await API.delete(`/workouts/${workout.id}`)
      setLoading(false)
      navigate('/workouts/your-workouts')
      setOpen(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Delete Workout
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
        <DialogContentText>
          Are you sure you want to delete this workout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color='error'
          disabled={loading}
          variant='contained'
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary',
              }}
            />
          ) : (
            'Delete'
          )}
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
