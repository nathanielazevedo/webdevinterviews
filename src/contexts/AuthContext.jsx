import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('access_token')
  const [displayName, setDisplayName] = useState(token ? 'loading' : '')

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const display = decoded?.sub
        setDisplayName(display)
      } catch {
        setDisplayName('')
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
