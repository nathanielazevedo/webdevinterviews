// THIS FILE SHOULD NEVER BE IMPORTED DIRECTLY
// IMPORT FROM AUTHCONTEXT

const BASE_URL = !import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'http://54.205.196.167'
const DELAY = import.meta.env.DEV ? 0 : 0

class API {
  constructor() {
    this.authToken = null
  }

  setAuthToken(token) {
    this.authToken = token
  }

  async fetchWithDelay(method, endpoint, body) {
    const token = this.authToken
    await new Promise((resolve) => {
      setTimeout(resolve, DELAY)
    })
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
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
    return this.fetchWithDelay('GET', endpoint)
  }

  post(endpoint, body) {
    return this.fetchWithDelay('POST', endpoint, body)
  }

  put(endpoint, body) {
    return this.fetchWithDelay('PUT', endpoint, body)
  }

  delete(endpoint, body) {
    console.log('delete')
    return this.fetchWithDelay('DELETE', endpoint, body)
  }
}

export default new API()
