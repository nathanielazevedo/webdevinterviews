import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:80'
  : 'https://api.webdevinterviews.com'

const isTokenExpired = (token) => {
  if (!token) {
    return false
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = decodedToken.exp * 1000
    const currentTime = new Date().getTime()

    return currentTime > expirationTime
  } catch (error) {
    console.error('Error decoding or parsing token:', error)
    return true
  }
}

const useApi = () => {
  const { API, authLoading, token, baseUrl, refreshAuthToken } =
    useContext(AuthContext)

  const makeRequest = async (method, endpoint, body) => {
    if (isTokenExpired(token)) {
      await refreshAuthToken()
    }
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
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
