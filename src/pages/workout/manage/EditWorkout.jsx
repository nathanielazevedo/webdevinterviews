/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TextField, Button, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { WorkoutContext } from '../root/WorkoutContext'
import DeleteDialog from '../dialogs/DeleteDialog'
import api from '../../../api'
import TemplateDependencies from '../../workouts/components/TemplateDependencies'
import { GET_DEPENDENCIES } from '../../../quieres'
import useFetch from '../../../hooks/useFetch'
import Workout from '../../../models/workout'

const keyOrder = ['title', 'image_link', 'youtube_link', 'is_public']

const EditWorkoutDialog = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    data: templateData,
    loading: loadingTemplates,
    error: loadingTemplatesError,
  } = useFetch(GET_DEPENDENCIES)

  const defaultValues = keyOrder.reduce((obj, key) => {
    obj[key] = workout[key]
    return obj
  }, {})

  defaultValues.sp_template_id = workout.spTemplateId

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

  if (loadingTemplates) return <p>Loading...</p>

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box>
          <h2>Manage Your Workouts Meta Data</h2>
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
          {/* <TemplateDependencies
            control={control}
            data={templateData}
            loading={loadingTemplates}
            error={loadingTemplatesError}
            workout={workout}
          /> */}
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
    </>
  )
}

export default EditWorkoutDialog
