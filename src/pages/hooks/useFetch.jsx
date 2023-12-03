import { useState, useEffect } from 'react'
// import API from '../../api'
import { useContext } from 'react'
import { LogContext } from '../LogContext'
import { AuthContext } from '../AuthContext'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addLog } = useContext(LogContext)
  const { API, authLoading } = useContext(AuthContext)

  const fetchData = async (url) => {
    setLoading(true)
    setError(null)
    addLog({
      method: 'info',
      data: [`Loading ${url}`],
    })
    try {
      const { data } = await API.get(url)
      setData(data)
      setLoading(false)
      addLog({
        method: 'log',
        data: [`Successfully loaded ${url}`],
        code: 200,
      })
    } catch (error) {
      setError(error)
      setLoading(false)
      addLog({
        method: 'error',
        data: [`Error loading ${url}`],
        code: 500,
      })
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchData(url)
    }
  }, [authLoading])

  return { data, loading, error, fetchData }
}

export default useFetch
