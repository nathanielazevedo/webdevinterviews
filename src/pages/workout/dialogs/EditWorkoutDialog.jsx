/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material'
import { Form } from 'react-router-dom'
import { useState, useContext } from 'react'
import WorkoutContext from '../WorkoutContext'

const keyOrder = [
  'name',
  'title',
  'filter',
  'difficulty',
  'image_link',
  'youtube_link',
]

const EditWorkoutDialog = ({ open, setOpen }) => {
  const { workout } = useContext(WorkoutContext)
  const [workoutForm, setWorkoutForm] = useState(workout)

  const handleChange = (event) => {
    setWorkoutForm({
      ...workout,
      [event.target.name]: event.target.value,
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Workout {workout.id}</DialogTitle>
      <DialogContent>
        <Form method='post' id='edit-workout-form'>
          {keyOrder.map((name) => {
            return (
              <TextField
                key={name}
                margin='dense'
                id={name}
                label={name}
                type='text'
                name={name}
                fullWidth
                variant='standard'
                defaultValue={workoutForm[name]}
                onChange={handleChange}
              />
            )
          })}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit' form='edit-workout-form' onClick={handleClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditWorkoutDialog
