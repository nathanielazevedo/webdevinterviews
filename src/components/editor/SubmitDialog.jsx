/* eslint-disable react/prop-types */
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import { Form, useLoaderData } from 'react-router-dom'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useLocation, redirect } from 'react-router-dom'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export async function action({ request, params }) {
  const formData = await request.formData()
  const workoutForm = Object.fromEntries(formData)
  workoutForm.template = JSON.parse(workoutForm.template)
  workoutForm.solution = JSON.parse(workoutForm.solution)
  workoutForm.newCode = JSON.parse(workoutForm.newCode)
  workoutForm.checkList = JSON.parse(workoutForm.checkList)

  if (workoutForm.isSolution === 'true') {
    workoutForm.solution = workoutForm.newCode
  } else {
    workoutForm.template = workoutForm.newCode
  }

  delete workoutForm.newCode

  fetch('http://localhost:3000/write', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutForm),
  })

  return redirect('/workouts/')
}

export default function FormDialog({ open, setOpen }) {
  const { sandpack } = useSandpack()
  const { workout } = useLoaderData()
  const location = useLocation()
  const isSolution = location.pathname.split('/').pop() === 'solution'

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: '500px', height: '500px' } }}
      >
        <DialogContent>
          <Form
            method='post'
            id='edit-workout-form'
            // action={`/workout/${workout.name}`}
          >
            <TextField
              margin='dense'
              id='template'
              label='template'
              type='text'
              name='template'
              fullWidth
              variant='standard'
              defaultValue={JSON.stringify(workout.template)}
            />
            <TextField
              margin='dense'
              id='solution'
              label='solution'
              type='text'
              name='solution'
              fullWidth
              variant='standard'
              defaultValue={JSON.stringify(workout.solution)}
            />
            <TextField
              margin='dense'
              id='solution'
              label='checkList'
              type='text'
              name='checkList'
              fullWidth
              variant='standard'
              defaultValue={JSON.stringify(workout.checkList)}
            />
            <TextField
              margin='dense'
              id='newCode'
              label='newCode'
              type='text'
              name='newCode'
              fullWidth
              variant='standard'
              defaultValue={JSON.stringify(sandpack.files)}
            />
            <TextField
              margin='dense'
              id='id'
              label='id'
              type='text'
              name='id'
              fullWidth
              variant='standard'
              defaultValue={workout?.id}
            />
            <TextField
              margin='dense'
              id='name'
              label='name'
              type='text'
              name='name'
              fullWidth
              variant='standard'
              defaultValue={workout?.name}
            />
            <TextField
              margin='dense'
              id='title'
              label='title'
              type='text'
              name='title'
              fullWidth
              variant='standard'
              defaultValue={workout?.title}
            />
            <TextField
              margin='dense'
              id='path'
              label='path'
              type='text'
              name='path'
              fullWidth
              variant='standard'
              defaultValue={workout?.path}
            />
            <TextField
              margin='dense'
              id='difficulty'
              label='difficulty'
              type='text'
              name='difficulty'
              fullWidth
              variant='standard'
              defaultValue={workout?.difficulty}
            />
            <TextField
              margin='dense'
              id='link'
              label='link'
              type='text'
              name='link'
              fullWidth
              variant='standard'
              defaultValue={workout?.link}
            />
            <FormControl sx={{ marginTop: '20px' }}>
              <FormLabel id='demo-row-radio-buttons-group-label'>
                Updating the:
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='isSolution'
                defaultValue={isSolution}
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='template'
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label='solution'
                />
              </RadioGroup>
            </FormControl>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type='submit' form='edit-workout-form'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
