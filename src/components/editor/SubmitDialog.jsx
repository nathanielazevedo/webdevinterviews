/* eslint-disable react/prop-types */
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import { useLoaderData } from 'react-router-dom'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useLocation } from 'react-router-dom'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export default function FormDialog({ open, setOpen }) {
  const { sandpack } = useSandpack()
  const { workout } = useLoaderData()
  const location = useLocation()
  const [workoutForm, setWorkoutForm] = React.useState(workout)
  const [error, setError] = React.useState(false)
  const [isSolution, setIsSolution] = React.useState(
    location.pathname.split('/').pop() === 'solution'
  )
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    if (isSolution) {
      workoutForm.solution = sandpack.files
    } else {
      workoutForm.template = sandpack.files
    }
    console.log('posting workoutForm', workoutForm)
    fetch('http://localhost:3000/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutForm),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text()
          console.log(error)
          setError(true)
        }
        const responseMessage = await res.text()
        console.log(responseMessage)
        setError(false)
        handleClose()
      })
      .catch((err) => {
        console.log(err)
        setError(true)
      })
  }

  const handleChange = (evt) => {
    const value = evt.target.value
    setWorkoutForm({
      ...workoutForm,
      [evt.target.name]: value,
    })
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: '500px', height: '500px' } }}
      >
        <DialogContent>
          <TextField
            margin='dense'
            id='id'
            label='id'
            type='text'
            name='id'
            fullWidth
            variant='standard'
            value={workoutForm?.id}
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            id='name'
            label='name'
            type='text'
            name='name'
            fullWidth
            variant='standard'
            value={workoutForm?.name}
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            id='title'
            label='title'
            type='text'
            name='title'
            fullWidth
            variant='standard'
            value={workoutForm?.title}
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            id='path'
            label='path'
            type='text'
            name='path'
            fullWidth
            variant='standard'
            value={workoutForm?.path}
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            id='difficulty'
            label='difficulty'
            type='text'
            name='difficulty'
            fullWidth
            variant='standard'
            value={workoutForm?.difficulty}
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            id='link'
            label='link'
            type='text'
            name='link'
            fullWidth
            variant='standard'
            value={workoutForm?.link}
            onChange={handleChange}
          />
          <FormControl sx={{ marginTop: '20px' }}>
            <FormLabel id='demo-row-radio-buttons-group-label'>
              Updating the:
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
              defaultValue={isSolution ? 'solution' : 'template'}
            >
              <FormControlLabel
                value='template'
                control={<Radio />}
                label='template'
              />
              <FormControlLabel
                value='solution'
                control={<Radio />}
                label='solution'
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color={error ? 'error' : 'primary'}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
