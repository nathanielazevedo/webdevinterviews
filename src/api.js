class API {
  constructor() {
    this.baseURL = import.meta.env.DEV
      ? 'https://api.webdevinterviews.com'
      : 'https://api.webdevinterviews.com'
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`)
    const data = await response.json()
    return data
  }

  async post(endpoint, body) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
  }

  // Add more methods for PUT, DELETE, etc. if needed
}

export default new API()
