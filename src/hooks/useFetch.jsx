import { useState, useEffect, useContext } from 'react'
import useApi from './useApi'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getIt } = useApi()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: responseData } = await getIt(url)
      setData(responseData)
      setLoading(false)
    } catch (thisError) {
      setError(thisError)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(url)
  }, [])

  return { data, loading, error, fetchData, setData }
}

export default useFetch
