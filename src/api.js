const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://43dn1oatja.execute-api.us-east-1.amazonaws.com/prod'
const DELAY = import.meta.env.DEV ? 2000 : 0

class API {
  constructor() {
    this.authToken = null
  }

  setAuthToken(token) {
    this.authToken = token
  }

  async fetchWithDelay(method, endpoint, body) {
    const token = this.authToken
    console.log('token', token)
    await new Promise((resolve) => setTimeout(resolve, DELAY))
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
}

export default new API()
