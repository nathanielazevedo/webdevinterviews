/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react'
import UserPool from '../userpool'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = UserPool.getCurrentUser()
    if (currentUser) {
      currentUser.getSession((err) => {
        if (err) {
          console.error(err)
        } else {
          setAuthenticated(true)
          setUser(currentUser)
          const idToken = currentUser.signInUserSession.getIdToken()
          const isAdmin = (idToken.payload['cognito:groups'] || []).includes(
            'admin'
          )
          setIsAdmin(isAdmin)
          console.log('Is user admin?', isAdmin)
        }
      })
    }
  }, [])

  const handleLogout = () => {
    const currentUser = UserPool.getCurrentUser()
    if (currentUser) {
      currentUser.signOut()
    }

    setAuthenticated(false)
    setUser(null)
    setIsAdmin(false)
  }

  const [loginAttempt, setLoginAttempt] = useState({ email: '', password: '' })

  const handleLogin = (email, password) => {
    // InvalidParameterException
    return new Promise((resolve, reject) => {
      setLoginAttempt({ email, password })
      const user = new CognitoUser({ Username: email, Pool: UserPool })
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          navigate('auth/account')
          setAuthenticated(true)
          const currentUser = UserPool.getCurrentUser()

          if (currentUser) {
            currentUser.getSession((err) => {
              if (err) {
                console.error(err)
              } else {
                setAuthenticated(true)
                setUser(currentUser)
              }
            })
          }
          resolve(data)
        },

        onFailure: (err) => {
          // InvalidPasswordException
          if (err.name === 'UserNotConfirmedException') {
            navigate('auth/verify-email', { state: { email, password } })
          } else if (err.name === 'NotAuthorizedException') {
            const error = new Error('Incorrect password')
            error.code = 'NotAuthorizedException'
            reject(error)
          } else {
            reject(err)
          }
        },

        newPasswordRequired: (data) => {
          console.log('newPasswordRequired:', data)
        },
      })
    })
  }

  const handleSignup = (email, username, password) => {
    return new Promise((resolve, reject) => {
      UserPool.signUp(
        email,
        password,
        [
          {
            Name: 'nickname',
            Value: username,
          },
        ],
        null,
        (err, data) => {
          if (err) {
            if (err.name === 'UsernameExistsException') {
              const error = new Error('Email already exists')
              error.code = 'UsernameExistsException'
              reject(error)
            } else {
              reject(err)
            }
          } else {
            navigate('auth/verify-email', { state: { email, password } })
            resolve(data)
          }
        }
      )
    })
  }

  const handleDeleteAccount = () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = UserPool.getCurrentUser()

      if (cognitoUser) {
        cognitoUser.getSession((err) => {
          if (err) {
            reject(err)
          } else {
            cognitoUser.deleteUser((err, result) => {
              if (err) {
                reject(err)
              } else {
                setAuthenticated(false)
                setUser(null)
                navigate('/auth/signup')
                resolve(result)
              }
            })
          }
        })
      } else {
        reject(new Error('No user is currently logged in'))
      }
    })
  }

  const handleVerifyEmail = (email, code) => {
    const userData = {
      Username: email,
      Pool: UserPool,
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        console.error(err)
        return
      }
      console.log('call result: ' + result)
      handleLogin(loginAttempt.email, loginAttempt.password)
    })
  }

  const handleForgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: UserPool,
      }

      const cognitoUser = new CognitoUser(userData)

      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          // successfully initiated reset password request
          console.log('CodeDeliveryData from forgotPassword: ' + data)
          resolve(data)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  const handleResetPassword = (email, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: UserPool,
      }

      const cognitoUser = new CognitoUser(userData)

      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve()
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        handleLogout,
        handleLogin,
        handleSignup,
        handleVerifyEmail,
        handleDeleteAccount,
        handleForgotPassword,
        handleResetPassword,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
