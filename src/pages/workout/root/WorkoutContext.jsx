/* eslint-disable react/prop-types */
import { createContext } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import WorkoutSkeleton from '../WorkoutSkeleton'

const WorkoutContext = createContext()

const WorkoutProvider = ({ children }) => {
  const params = useParams()

  const { data: workoutData, loading } = useFetch(`/workouts/${params.id}`)

  if (loading) {
    return <WorkoutSkeleton />
  }
  return (
    <WorkoutContext.Provider value={{ workoutData }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext, WorkoutProvider }
