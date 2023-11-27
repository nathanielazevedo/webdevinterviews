/* eslint-disable react/prop-types */
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
import { createContext, useState, useEffect } from 'react'
import cognito from '../aws-config'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedIdToken = localStorage.getItem('idToken')

      if (storedAccessToken && storedIdToken) {
        // Tokens exist in local storage, set the authenticated state
        setAuthenticated(true)
      } else {
        // Tokens not found in local storage, check Cognito session
        const userPoolId = 'your-user-pool-id'
        const clientId = 'your-app-client-id'
        const userPoolData = {
          UserPoolId: userPoolId,
          ClientId: clientId,
        }

        const userPool = new CognitoUserPool(userPoolData)
        const userData = {
          Username: 'username', // Replace with the user's actual username
          Pool: userPool,
        }

        const cognitoUser = new CognitoUser(userData)

        cognitoUser.getSession((err, session) => {
          if (err) {
            console.error('Error checking session:', err)
            setAuthenticated(false)
          } else {
            // Session exists, user is authenticated
            setAuthenticated(true)
            // Store tokens in local storage for future sessions
            localStorage.setItem(
              'accessToken',
              session.getAccessToken().getJwtToken()
            )
            localStorage.setItem('idToken', session.getIdToken().getJwtToken())
          }
        })
      }
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    const authenticationData = {
      Username: 'username', // Replace with the user's actual username
      Password: 'password', // Replace with the user's actual password
    }

    const authenticationDetails = new cognito(authenticationData)

    const userPoolId = 'your-user-pool-id'
    const clientId = 'your-app-client-id'
    const userPoolData = {
      UserPoolId: userPoolId,
      ClientId: clientId,
    }

    const userPool = new cognito.CognitoUserPool(userPoolData)
    const userData = {
      Username: 'username', // Replace with the user's actual username
      Pool: userPool,
    }

    const cognitoUser = new cognito.CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        // Session is authenticated, you can set the tokens as HttpOnly cookies
        document.cookie = `accessToken=${session
          .getAccessToken()
          .getJwtToken()}; path=/; HttpOnly`
        document.cookie = `idToken=${session
          .getIdToken()
          .getJwtToken()}; path=/; HttpOnly`

        setAuthenticated(true)
      },
      onFailure: (err) => {
        console.error('Error authenticating user:', err)
        setAuthenticated(false)
      },
    })
  }

  const handleLogout = () => {
    // Clear the tokens from cookies
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
