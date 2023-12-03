import { useState } from 'react'
import WorkoutTopNav from './WorkoutTopNav'
import WorkoutContext from './WorkoutContext'
import WorkoutSideNav from './WorkoutSideNav'
import DeleteDialog from './dialogs/DeleteDialog'
import { Outlet, redirect } from 'react-router-dom'
import EditWorkoutDialog from './dialogs/EditWorkoutDialog'
import API from '../../api'
import useFetch from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import WorkoutSkeleton from './WorkoutSkeleton'
import { MiddleContent, OutletContainer, RootFrame } from '../../styled'

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
  const params = useParams()

  const { data: workout, loading } = useFetch(`/workouts/${params.id}`)

  if (loading) {
    return <WorkoutSkeleton />
  }

  return (
    <WorkoutContext.Provider value={{ workout }}>
      <RootFrame>
        <WorkoutTopNav
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
        />
        <MiddleContent>
          <WorkoutSideNav />
          <OutletContainer>
            <Outlet />
          </OutletContainer>
        </MiddleContent>
      </RootFrame>
      <EditWorkoutDialog open={editDialogOpen} setOpen={setEditDialogOpen} />
      <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </WorkoutContext.Provider>
  )
}

export default WorkoutRoot
