import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const RootRedirect = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/workouts/official')
  }, [])

  return <div />
}

export default RootRedirect
