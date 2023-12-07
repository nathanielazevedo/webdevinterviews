import API from '../../api'
import PropTypes from 'prop-types'
import { Form, redirect } from 'react-router-dom'
import { useSandpack } from '@codesandbox/sandpack-react'
import { ObjectInspector, chromeDark } from 'react-inspector'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const UploadCodeDialog = ({ open, setOpen }) => {
  const { sandpack } = useSandpack()

  const handleClose = () => {
    setOpen(false)
  }

  // Define your schema
  const schema = yup.object().shape({
    uploadAs: yup.string().required(),
    code: yup.string().required(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async ({ request, params }) => {
    try {
      const formData = await request.formData()
      const workoutForm = Object.fromEntries(formData)

      if (workoutForm.uploadAs === 'template') {
        workoutForm.template = JSON.stringify(workoutForm.code)
      } else {
        workoutForm.solution = JSON.stringify(workoutForm.code)
      }

      delete workoutForm.code
      delete workoutForm.uploadAs

      await API.put(`/workouts/${params.id}`, workoutForm)
      console.log('put now redirect')
      return redirect(`/workouts/${params.id}`)
    } catch (error) {
      console.error(`Failed to update workout: ${error.message}`)
      // Handle the error here, e.g., by showing an error message to the user
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Upload Files</DialogTitle>
      <DialogContent>
        <Form
          method='post'
          id='upload-code-form'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              padding: '10px 20px 20px 20px',
            }}
          >
            <ObjectInspector
              data={sandpack.files}
              // name='files'
              theme={{
                ...chromeDark,
                ...{
                  TREENODE_PADDING_LEFT: 15,
                  BASE_FONT_SIZE: '15px',
                  BASE_FONT_FAMILY: 'Bai jamjuree',
                  BASE_BACKGROUND_COLOR: 'transparent',
                  TREENODE_FONT_FAMILY: 'Bai jamjuree',
                  TREENODE_LINE_HEIGHT: 1.5,
                  ARROW_FONT_SIZE: 10,
                  OBJECT_NAME_COLOR: 'white',
                  OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 3,
                  OBJECT_VALUE_STRING_COLOR: '#19e4ff',
                },
              }}
              expandLevel={1}
            />
            <FormControl variant='outlined' margin='normal' fullWidth>
              <InputLabel id='uploadAs-label'>Upload As</InputLabel>
              <Select
                labelId='uploadAs-label'
                id='uploadAs'
                {...register('uploadAs')}
                error={!!errors.uploadAs}
              >
                <MenuItem value='template'>Template</MenuItem>
                <MenuItem value='solution'>Solution</MenuItem>
              </Select>
              {errors.uploadAs && (
                <FormHelperText error>{errors.uploadAs.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl variant='outlined' margin='normal' fullWidth>
              <InputLabel id='code-label'>Code</InputLabel>
              <TextField
                id='code'
                type='text'
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </FormControl>
            <input {...register('uploadAs')} />
            <input {...register('code')} />
            {/* Display errors */}
            {errors.uploadAs && <p>{errors.uploadAs.message}</p>}
            {errors.code && <p>{errors.code.message}</p>}
          </Box>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

UploadCodeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default UploadCodeDialog
