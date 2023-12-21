/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
// import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  DialogContentText,
  Typography,
  Box,
  Fade,
} from '@mui/material'
import { useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from 'react-hook-form'
import { LogContext } from '../../LogContext'
import { AuthContext } from '../../AuthContext'
import TemplateDependencies from '../components/TemplateDependencies'

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  sp_template_id: Yup.string().required('Template is required'),
  dependencies: Yup.array().of(Yup.string()),
})

const CreateWorkoutDialog = ({
  open,
  setOpen,
  data,
  loading: loadingTemplates,
  error,
}) => {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  console.log('data', data)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      sp_template_id: data[0].id,
    },
  })

  const { addLog } = useContext(LogContext)
  const { API } = useContext(AuthContext)

  const handleClose = () => {
    setOpen(false)
  }

  // const [errors, setErrors] = useState({})

  const onSubmit = async (datas) => {
    setLoading(true)
    try {
      const res = await API.post('/workouts', datas)
      addLog({
        method: 'log',
        data: ['Workout created.'],
      })
      setLoading(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        handleClose()
        navigate(`/workouts/${res.data.workout_id}/manage`)
      }, 3000)
    } catch (submissionError) {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      {showSuccess ? null : (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Create a Workout
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
      )}
      <DialogContent>
        {showSuccess ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '200px',
              justifyContent: 'center',
            }}
          >
            <Fade in={showSuccess} timeout={1000}>
              <Box
                sx={{
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    marginBottom: '20px',
                  }}
                >
                  Workout created successfully!
                </Typography>
                <Typography
                  sx={{
                    color: 'grey.300',
                  }}
                >
                  I'm sending you to the management page.
                </Typography>
              </Box>
            </Fade>
          </Box>
        ) : (
          <>
            <DialogContentText mb='20px'>
              Fill out the basic information needed for your workout. <br />
              You change and customize your workout after it is created.
            </DialogContentText>
            {errors.submission && (
              <Alert severity='error'>{errors.submission}</Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} id='create-workout-form'>
              <TextField
                margin='dense'
                id='title'
                label={'title'.charAt(0).toUpperCase() + 'title'.slice(1)}
                type='text'
                name='title'
                fullWidth
                variant='outlined'
                {...register('title', { required: true })}
                error={!!errors.title}
                helperText={errors.title?.message ?? 'Title of your workout.'}
              />

              <TemplateDependencies
                control={control}
                setValue={setValue}
                data={data}
                loading={loadingTemplates}
                error={error}
                errors={errors}
              />
            </form>
          </>
        )}
      </DialogContent>
      {showSuccess ? null : (
        <DialogActions
          sx={{
            padding: '30px 30px',
          }}
        >
          <Button
            type='submit'
            form='create-workout-form'
            variant='outlined'
            fullWidth
            disabled={loading && loadingTemplates}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.main',
                }}
              />
            ) : (
              'Create Workout'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

CreateWorkoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default CreateWorkoutDialog
