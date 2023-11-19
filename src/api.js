class API {
  constructor() {
    this.baseURL = import.meta.env.DEV
      ? 'http://localhost:5000'
      : 'https://api.webdevinterviews.com'
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Fetch failed: ${error.message}`)
      throw error
    }
  }

  async post(endpoint, body) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Fetch failed: ${error.message}`)
      throw error
    }
  }

  async put(endpoint, body) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Fetch failed: ${error.message}`)
      throw error
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.status
    } catch (error) {
      console.error(`Fetch failed: ${error.message}`)
      throw error
    }
  }
}

export default new API()
