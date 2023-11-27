import { useState } from 'react'
import Box from '@mui/material/Box'
import { Fade } from '@mui/material'
import WorkoutTopNav from './WorkoutTopNav'
import WorkoutContext from './WorkoutContext'
import WorkoutSideNav from './WorkoutSideNav'
import DeleteDialog from './dialogs/DeleteDialog'
import { Outlet, redirect, useLoaderData } from 'react-router-dom'
import EditWorkoutDialog from './dialogs/EditWorkoutDialog'
import API from '../../api'

export const loader = async ({ params }) => {
  try {
    const { data: workout } = await API.get(`/workouts/${params.id}`)
    workout.solution = JSON.parse(workout.solution)
    workout.template = JSON.parse(workout.template)
    return { workout }
  } catch (error) {
    console.error(`Failed to load workout: ${error.message}`)
    if (error.response.status === 404) {
      throw new Error('Not found')
    } else {
      throw error
    }
  }
}

export const action = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const workoutForm = Object.fromEntries(formData)
    // Handle the 'filter' entry
    if (workoutForm.filter) {
      workoutForm.filter = workoutForm.filter
        .split(',')
        .map((word) => word.trim())
    }
    await API.put(`/workouts/${params.id}`, workoutForm)
    return redirect(`/workouts/${params.id}`)
  } catch (error) {
    console.error(`Failed to update workout: ${error.message}`)
    // Handle the error here, e.g., by showing an error message to the user
  }
}

const WorkoutRoot = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <WorkoutContext.Provider value={useLoaderData()}>
      <Fade in={true} timeout={1000}>
        <Box
          flex={1}
          height={'calc(100vh - 63px)'}
          sx={{
            height: 'calc(100vh - 63px)',
            maxHeight: 'calc(100vh - 63px)',
          }}
        >
          <WorkoutTopNav
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
          />
          <Box
            display='flex'
            flex={1}
            height={'100%'}
            sx={{
              height: 'calc(100vh - 63px)',
              maxHeight: 'calc(100vh - 63px)',
            }}
          >
            <WorkoutSideNav />
            <Box flex={1}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Fade>
      <EditWorkoutDialog open={editDialogOpen} setOpen={setEditDialogOpen} />
      <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </WorkoutContext.Provider>
  )
}

export default WorkoutRoot
