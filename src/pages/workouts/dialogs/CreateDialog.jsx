import * as Yup from 'yup'
import api from '../../../api'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
} from '@mui/material'
import { useContext } from 'react'
import { LogContext } from '../../LogContext' // Replace with the actual path to LogContext

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  title: Yup.string().required('Title is required'),
})

const CreateWorkoutDialog = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const { addLog } = useContext(LogContext)
  const [workout, setWorkout] = useState({
    name: '',
    title: '',
  })

  const handleChange = (event) => {
    setWorkout({
      ...workout,
      [event.target.name]: event.target.value,
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [errors, setErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({}) // Clear the errors

    try {
      await schema.validate(workout)
    } catch (validationError) {
      setErrors({ validation: validationError.message })
      return // Stop the execution if the validation fails
    }

    try {
      const res = await api.post('/workouts', workout)
      addLog(`Workout created.`)
      handleClose()
      return navigate('/workouts/' + res.id)
    } catch (submissionError) {
      setErrors({
        submission: `Failed to create workout: ${submissionError.message}`,
      })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a Workout</DialogTitle>
      <DialogContent>
        {errors.submission && (
          <Alert severity='error'>{errors.submission}</Alert>
        )}
        <form onSubmit={handleSubmit} id='create-workout-form'>
          {Object.keys(workout).map((name) => (
            <TextField
              key={name}
              margin='dense'
              id={name}
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              type='text'
              name={name}
              fullWidth
              variant='standard'
              value={workout[name]}
              onChange={handleChange}
              required
              autoComplete='off'
              error={!!errors.validation && name in errors.validation}
              helperText={errors.validation && errors.validation[name]}
            />
          ))}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit' form='create-workout-form' color='success'>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CreateWorkoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default CreateWorkoutDialog
