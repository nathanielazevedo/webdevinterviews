import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../pages/AuthContext'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { API, authLoading } = useContext(AuthContext)

  const fetchData = async () => {
    if (authLoading) return
    setLoading(true)
    setError(null)
    try {
      const { data: responseData } = await API.get(url)
      setData(responseData)
      setLoading(false)
    } catch (thisError) {
      setError(thisError)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchData(url)
    }
  }, [authLoading, url])

  return { data, loading, error, fetchData, setData }
}

export default useFetch
