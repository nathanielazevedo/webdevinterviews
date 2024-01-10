/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TextField, Button, Box } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import SelectInput from '../../../components/form/Select'
import { WorkoutContext } from '../root/WorkoutContext'
import DeleteDialog from '../dialogs/DeleteDialog'
import api from '../../../api'
import TemplateDependencies from '../../workouts/components/TemplateDependencies'
import { GET_DEPENDENCIES } from '../../../quieres'
import useFetch from '../../../hooks/useFetch'
import Workout from '../../../models/workout'

const keyOrder = [
  'title',
  'youtubeLink',
  'isPublic',
  'difficulty',
  'sp_template_id',
]

const EditWorkoutDialog = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  console.log(workout)

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

  console.log(defaultValues)

  const {
    register,
    handleSubmit,
    control,
    setValue,
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
          padding: '10px 30px',
        }}
      >
        <Box>
          <h2>Manage Your Workouts Meta Data</h2>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} id='edit-workout-form'>
          <TextField
            margin='dense'
            id='title'
            label='Title'
            type='text'
            name='title'
            fullWidth
            variant='outlined'
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <SelectInput
            name='isPublic'
            control={control}
            label='Public'
            onChange={(event) => setValue('isPublic', event.target.value)}
          >
            <MenuItem value>
              <Typography>True</Typography>
            </MenuItem>
            <MenuItem value={false}>
              <Typography>False</Typography>
            </MenuItem>
          </SelectInput>
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
