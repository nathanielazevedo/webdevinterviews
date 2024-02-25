import { createContext, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const WorkoutContext = createContext()

const WorkoutProvider = ({ children }) => {
  const params = useParams()
  const { data: workout, loading, error } = useFetch(`/workouts/${params.id}`)
  const [fromLocal, setFromLocal] = useState(false)
  const navigate = useNavigate()

  if (loading) return null

  if (error && error.status == 403) {
    navigate('/new-member')
    return
  }

  return (
    <WorkoutContext.Provider value={{ workout, fromLocal, setFromLocal }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext, WorkoutProvider }
