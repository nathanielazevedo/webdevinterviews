import { useState, useEffect, useContext } from 'react'

const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://api.webdevinterviews.com'

const useApi = () => {
  const makeRequest = async (method, endpoint, body) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) options.body = JSON.stringify(body)
    const response = await fetch(`${BASE_URL}${endpoint}`, options)

    if (!response.ok) {
      const errorBody = await response.text()
      const error = new Error(
        `HTTP error! status: ${response.status}, status text: ${response.statusText}, body: ${errorBody}`
      )
      error.status = response.status
      throw error
    }

    return { data: await response.json() }
  }

  const getIt = (endpoint) => {
    return makeRequest('GET', endpoint)
  }

  const postIt = (endpoint, body) => {
    return makeRequest('POST', endpoint, body)
  }

  const putIt = (endpoint, body) => {
    return makeRequest('PUT', endpoint, body)
  }

  const deleteIt = (endpoint, body) => {
    return makeRequest('DELETE', endpoint, body)
  }

  return { getIt, postIt, putIt, deleteIt }
}

export default useApi
