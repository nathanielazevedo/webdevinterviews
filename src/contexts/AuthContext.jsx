import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [displayName, setDisplayName] = useState()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const decoded = jwtDecode(token)
      const display = decoded?.sub
      setDisplayName(display)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
