const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://api.webdevinterviews.com'
const DELAY = import.meta.env.DEV ? 2000 : 0

class API {
  async fetchWithDelay(method, endpoint, body) {
    await new Promise((resolve) => setTimeout(resolve, DELAY))
    const options = body
      ? {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : { method }
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
