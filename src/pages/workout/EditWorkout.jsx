/* eslint-disable react/prop-types */
import { TextField, Button, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import WorkoutContext from './WorkoutContext'
import MultiSelect from '../../components/form/MultiSelect'
import DeleteDialog from './dialogs/DeleteDialog'
import api from '../../api'

const keyOrder = ['name', 'title', 'image_link', 'youtube_link']

const dependencies = ['react-router-dom', 'react-redux', 'typescript']
const tags = ['react', 'redux', 'router']
const difficulty = ['junior', 'mid-level', 'senior']

const EditWorkoutDialog = () => {
  const { workout } = useContext(WorkoutContext)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultValues = keyOrder.reduce((obj, key) => {
    obj[key] = workout[key]
    return obj
  }, {})
  defaultValues.dependencies = Object.keys(workout.dependencies)
  defaultValues.tags = workout.tags

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/workouts/${workout.id}`, data)
    } catch {
      console.log('error')
    }
    setLoading(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        <Box>
          <h1>Edit Workout</h1>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} id='edit-workout-form'>
          {keyOrder.map((name) => (
            <TextField
              key={name}
              margin='dense'
              id={name}
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              type='text'
              name={name}
              fullWidth
              variant='outlined'
              {...register(name)}
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          ))}
          <MultiSelect
            name='dependencies'
            control={control}
            options={dependencies}
            label='Dependencies'
          />
          <MultiSelect
            name='tags'
            control={control}
            options={tags}
            label='Tags'
          />
        </form>
        <Button
          type='submit'
          form='edit-workout-form'
          variant='contained'
          sx={{ marginTop: '20px' }}
        >
          Save Changes
        </Button>
        <Button
          type='submit'
          form='edit-workout-form'
          variant='contained'
          color='error'
          sx={{ marginTop: '20px' }}
          onClick={() => {
            setDeleteDialogOpen(!deleteDialogOpen)
          }}
        >
          Delete Workout
        </Button>
      </Box>
      <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </Box>
  )
}

export default EditWorkoutDialog
