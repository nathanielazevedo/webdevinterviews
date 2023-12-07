// import * as Yup from 'yup'
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
import { useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import SelectInput from '../../../components/form/Select'
import MultiSelect from '../../../components/form/MultiSelect'
import { LogContext } from '../../LogContext'
import api from '../../../api'

// const schema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   title: Yup.string().required('Title is required'),
//   sp_template: Yup.string().required('Template is required'),
// })

const dependencies = ['react-router-dom', 'react-redux', 'typescript']

const CreateWorkoutDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const { addLog } = useContext(LogContext)
  const [workout] = useState({
    name: '',
    title: '',
  })

  const handleClose = () => {
    setOpen(false)
  }

  // const [errors, setErrors] = useState({})

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/workouts', data)
      addLog({
        method: 'log',
        data: ['Workout created.'],
      })
      handleClose()
      setLoading(false)
      return navigate(`/workouts/${res.data.id}`)
    } catch (submissionError) {
      setLoading(false)
      return navigate('/workouts')
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
        Create Workout
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
        {errors.submission && (
          <Alert severity='error'>{errors.submission}</Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} id='create-workout-form'>
          {Object.keys(workout).map((name) => (
            <TextField
              key={name}
              margin='dense'
              id={name}
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              type='text'
              name={name}
              fullWidth
              variant='outlined'
              {...register(name, { required: true })}
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          ))}
          <SelectInput name='sp_template' control={control} label='Template'>
            <MenuItem value='vanilla'>Vanilla JS</MenuItem>
            <MenuItem value='react'>React</MenuItem>
          </SelectInput>
          <MultiSelect
            name='dependencies'
            control={control}
            options={dependencies}
            label='Dependencies'
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
        <Button
          type='submit'
          form='create-workout-form'
          variant='contained'
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary',
              }}
            />
          ) : (
            'Create'
          )}
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
