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
import { useState, useContext } from 'react'
import { Form } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import api from '../../../api'
import EditorContext from '../EditorContext'

const keyOrder = [
  'name',
  'title',
  'filter',
  'difficulty',
  'image_link',
  'youtube_link',
  'solution',
  'template',
  'checklist',
]

export async function action({ request }) {
  const formData = await request.formData()
  const workoutForm = Object.fromEntries(formData)
  const res = await api.post('/workouts', workoutForm)
  return redirect('/workouts/' + res.id)
}

const WorkoutDialog = ({ open, setOpen }) => {
  const { workout } = useContext(EditorContext)
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

export default WorkoutDialog
