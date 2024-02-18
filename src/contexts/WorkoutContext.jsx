import { createContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import WorkoutSkeleton from '../pages/workout/WorkoutSkeleton'
import Workout from '../models/workout'

const WorkoutContext = createContext()

const WorkoutProvider = ({ children }) => {
  const params = useParams()
  const { data, loading, setData } = useFetch(`/workouts/${params.id}`)
  const [fromLocal, setFromLocal] = useState(false)

  if (loading) return <WorkoutSkeleton />

  try {
    const workout = new Workout(data)
    return (
      <WorkoutContext.Provider
        value={{ workout, setData, fromLocal, setFromLocal }}
      >
        {children}
      </WorkoutContext.Provider>
    )
  } catch {
    return 'bad boy'
  }
}

export { WorkoutContext, WorkoutProvider }
