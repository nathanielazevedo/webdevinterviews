import { createContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

const WorkoutContext = createContext()

const WorkoutProvider = ({ children }) => {
  const params = useParams()
  const { data, loading, setData } = useFetch(`/workouts/${params.id}`)
  const [fromLocal, setFromLocal] = useState(false)

  if (loading) return null

  return (
    <WorkoutContext.Provider
      value={{ workout: data, setData, fromLocal, setFromLocal }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext, WorkoutProvider }
