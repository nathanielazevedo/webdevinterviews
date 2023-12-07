import { Outlet, redirect, useParams } from 'react-router-dom'
import WorkoutTopNav from './WorkoutTopNav'
import WorkoutContext from './WorkoutContext'
import WorkoutSideNav from './WorkoutSideNav'
import API from '../../api'
import useFetch from '../hooks/useFetch'
import WorkoutSkeleton from './WorkoutSkeleton'
import {
  MiddleContent,
  OutletContainer,
  RootFrame,
} from '../../rootStyledComponents'

export const action = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const workoutForm = Object.fromEntries(formData)
    if (workoutForm.filter) {
      workoutForm.filter = workoutForm.filter
        .split(',')
        .map((word) => word.trim())
    }
    await API.put(`/workouts/${params.id}`, workoutForm)
    return redirect(`/workouts/${params.id}`)
  } catch (error) {
    return redirect('/workouts')
  }
}

const WorkoutRoot = () => {
  const params = useParams()

  const { data: workout, loading } = useFetch(`/workouts/${params.id}`)

  if (loading) {
    return <WorkoutSkeleton />
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <WorkoutContext.Provider value={{ workout }}>
      <RootFrame>
        <WorkoutTopNav />
        <MiddleContent>
          <WorkoutSideNav />
          <OutletContainer>
            <Outlet />
          </OutletContainer>
        </MiddleContent>
      </RootFrame>
    </WorkoutContext.Provider>
  )
}

export default WorkoutRoot
