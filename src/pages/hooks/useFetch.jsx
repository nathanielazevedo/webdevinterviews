import { useState, useEffect } from 'react'
import API from '../../api'
import { useContext } from 'react'
import { LogContext } from '../LogContext'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addLog } = useContext(LogContext)

  useEffect(() => {
    const fetchData = async () => {
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
        })
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
