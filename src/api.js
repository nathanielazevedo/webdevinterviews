/* eslint-disable no-constructor-return */
// THIS FILE SHOULD NEVER BE IMPORTED DIRECTLY
// IMPORT FROM AUTHCONTEXT

const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:80'
  : 'https://api.webdevinterviews.com'

class API {
  constructor() {
    if (!API.instance) {
      this.authToken = null
      this.refreshAuthToken = null
      API.instance = this
    }

    return API.instance
  }

  setAuthToken(token) {
    this.authToken = token
  }

  isTokenExpired() {
    if (!this.authToken) {
      return false
    }

    try {
      const decodedToken = JSON.parse(atob(this.authToken.split('.')[1]))
      const expirationTime = decodedToken.exp * 1000 // Convert to milliseconds
      const currentTime = new Date().getTime()

      return currentTime > expirationTime
    } catch (error) {
      console.error('Error decoding or parsing token:', error)
      return true // Treat decoding or parsing errors as expired
    }
  }

  async fetch(method, endpoint, body) {
    if (this.isTokenExpired()) {
      // Handle token expiration, e.g., trigger a refresh or redirect to login
      await this.refreshAuthToken()
    }
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.authToken}`,
      },
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
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

  get(endpoint) {
    return this.fetch('GET', endpoint)
  }

  post(endpoint, body) {
    return this.fetch('POST', endpoint, body)
  }

  put(endpoint, body) {
    return this.fetch('PUT', endpoint, body)
  }

  delete(endpoint, body) {
    return this.fetch('DELETE', endpoint, body)
  }
}

export default new API()
