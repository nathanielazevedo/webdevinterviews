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
import { useState } from 'react'
import { Form } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import api from '../../../api'
import PropTypes from 'prop-types'

export async function action({ request }) {
  const formData = await request.formData()
  const workoutForm = Object.fromEntries(formData)
  const res = await api.post('/workouts', workoutForm)
  return redirect('/workouts/' + res.id)
}

const CreateWorkoutDialog = ({ open, setOpen }) => {
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a Workout</DialogTitle>
      <DialogContent>
        <Form method='post' id='edit-workout-form'>
          {Object.keys(workout).map((name) => {
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
                defaultValue={workout?.name}
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

export default CreateWorkoutDialog

CreateWorkoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}
