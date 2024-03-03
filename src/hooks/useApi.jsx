import { useState, useEffect, useContext } from 'react'

const BASE_URL = import.meta.env.DEV
  ? 'https://api.webdevinterviews.com'
  : 'https://api.webdevinterviews.com'

const useApi = () => {
  const makeRequest = async (method, endpoint, body) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (localStorage.getItem('access_token')) {
      options.headers.Authorization = `Bearer ${localStorage.getItem(
        'access_token'
      )}`
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

  const getIt = (endpoint) => makeRequest('GET', endpoint)

  const postIt = (endpoint, body) => makeRequest('POST', endpoint, body)

  const putIt = (endpoint, body) => makeRequest('PUT', endpoint, body)

  const deleteIt = (endpoint, body) => makeRequest('DELETE', endpoint, body)

  return { getIt, postIt, putIt, deleteIt }
}

export default useApi
