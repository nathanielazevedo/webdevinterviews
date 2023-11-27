import API from '../../api'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, redirect } from 'react-router-dom'
import { useSandpack } from '@codesandbox/sandpack-react'
import { ObjectInspector, chromeDark } from 'react-inspector'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from '@mui/material'

export const action = async ({ request, params }) => {
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

const UploadCodeDialog = ({ open, setOpen }) => {
  const [selectedOption, setSelectedOption] = useState('template')
  const { sandpack } = useSandpack()

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Upload Files</DialogTitle>
      <DialogContent>
        <Form method='post' id='upload-code-form'>
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
          </Box>
          <input
            type='hidden'
            name='code'
            value={JSON.stringify(sandpack.files)}
          />

          <RadioGroup
            value={selectedOption}
            onChange={handleChange}
            name='uploadAs'
            row
          >
            <FormControlLabel
              value='template'
              control={<Radio />}
              label='Template'
            />
            <FormControlLabel
              value='solution'
              control={<Radio />}
              label='Solution'
            />
          </RadioGroup>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color='primary' form='upload-code-form' type='submit'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

UploadCodeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default UploadCodeDialog
