import { createContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Workout from '../models/workout'

const WorkoutContext = createContext()

const WorkoutProvider = ({ children }) => {
  const params = useParams()
  const { data, loading, setData } = useFetch(`/workouts/${params.id}`)
  const [fromLocal, setFromLocal] = useState(false)

  if (loading) return null

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
    return 'Error'
  }
}

export { WorkoutContext, WorkoutProvider }
