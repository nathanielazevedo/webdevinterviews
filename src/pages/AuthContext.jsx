/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react'
import UserPool from '../userpool'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { useNavigate } from 'react-router-dom'
import { LogContext } from './LogContext'
import API from '../api'
const isDev = import.meta.env.DEV
const delay = isDev ? 2000 : 0

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState(null)
  const { addLog } = useContext(LogContext)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userAttributes, setUserAttributes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleSession = (currentUser) => {
    return new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error(err)
          setError(err)
          addLog({
            method: 'error',
            data: ['Not logged in.'],
          })
          reject(err)
          setLoading(false)
        } else {
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error(err)
              setError(err)
              reject(err)
            } else {
              const userAttributes = attributes.reduce((acc, attribute) => {
                acc[attribute.getName()] = attribute.getValue()
                return acc
              }, {})
              setUserAttributes(userAttributes)
              setLoading(false)
            }
          })
          setAuthenticated(true)
          setUser(currentUser)
          addLog({
            method: 'log',
            data: ['Logged in.'],
          })
          const idToken = session.getIdToken()
          API.setAuthToken(idToken.jwtToken)
          const isAdmin = (idToken.payload['cognito:groups'] || []).includes(
            'admin'
          )
          setIsAdmin(isAdmin)
          resolve(session)
          setLoading(false)
        }
      })
    })
  }

  useEffect(() => {
    const currentUser = UserPool.getCurrentUser()
    addLog({
      method: 'info',
      data: ['Checking session.'],
    })
    if (currentUser) {
      if (isDev) {
        setTimeout(() => handleSession(currentUser), 2000) // Delay of 2 seconds
      } else {
        handleSession(currentUser)
      }
    } else {
      setLoading(false)
      addLog({
        method: 'error',
        data: ['Not logged in.'],
      })
    }
  }, [])

  const handleLogin = async (email, password) => {
    if (authenticated) {
      return // If the user is already authenticated, don't run the function
    }
    addLog({
      method: 'info',
      data: ['Logging in.'],
    })
    const user = new CognitoUser({ Username: email, Pool: UserPool })
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    try {
      await new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
          onSuccess: (data) => {
            setTimeout(() => resolve(data), 2000)
          },
          onFailure: (err) => {
            reject(err)
          },
        })
      })
      const currentUser = UserPool.getCurrentUser()
      if (currentUser) {
        await handleSession(currentUser)
        navigate('workouts')
        setAuthenticated(true)
      }
    } catch (err) {
      console.error(err)
      setError(err)
    }
  }

  const handleSignup = (email, username, password) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        {
          Name: 'nickname',
          Value: username,
        },
      ]

      UserPool.signUp(email, password, attributeList, null, (err, data) => {
        if (err) {
          if (err.name === 'UsernameExistsException') {
            const error = new Error('This email is already in use.')
            error.code = 'UsernameExistsException'
            reject(error)
          } else {
            reject(err)
          }
        } else {
          setTimeout(() => resolve(data), 2000)
          navigate('auth/verify-email', { state: { email } })
          addLog({
            method: 'log',
            data: ['User signed up.'],
          })
        }
      })
    })
  }

  const handleVerifyEmail = (email, code) => {
    addLog({
      method: 'info',
      data: ['Verifying email.'],
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          Username: email,
          Pool: UserPool,
        }

        const cognitoUser = new CognitoUser(userData)

        cognitoUser.confirmRegistration(code, true, function (err, result) {
          if (err) {
            if (err.code === 'CodeMismatchException') {
              reject(new Error('The provided code does not match our records.'))
            } else if (err.code === 'NotAuthorizedException') {
              reject(
                new Error('This email address is already verified. Login.')
              )
            } else if (err.code === 'ExpiredCodeException') {
              reject(new Error(err.message))
            } else {
              reject(err)
            }
            return
          }
          console.log('call result: ' + result)
          addLog({
            method: 'log',
            data: ['Email verified. You may now login.'],
          })
          resolve(result)
        })
      }, delay)
    })
  }

  const handleResendVerificationCode = (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          Username: email,
          Pool: UserPool,
        }

        const cognitoUser = new CognitoUser(userData)

        cognitoUser.resendConfirmationCode((err, result) => {
          if (err) {
            reject(err)
          } else {
            addLog(`Confirmation code resent to ${email}.`)
            resolve(result)
          }
        })
      }, delay)
    })
  }

  const handleLogout = () => {
    addLog({
      method: 'info',
      data: ['Logging out.'],
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = UserPool.getCurrentUser()
        if (currentUser) {
          currentUser.signOut()
          setAuthenticated(false)
          addLog({
            method: 'log',
            data: ['Logged out.'],
          })
          setUser(null)
          setIsAdmin(false)
          setUserAttributes(null)
          resolve()
        } else {
          reject(new Error('No user is currently logged in'))
        }
      }, delay)
    })
  }

  const handleDeleteAccount = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        addLog({
          method: 'info',
          data: ['Deleting Account.'],
        })
        setTimeout(() => {
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
                    addLog({
                      method: 'log',
                      data: ['Account deleted.'],
                    })
                  }
                })
              }
            })
          } else {
            reject(new Error('No user is currently logged in'))
          }
        }, delay)
      }, delay)
    })
  }

  const handleForgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          Username: email,
          Pool: UserPool,
        }

        const cognitoUser = new CognitoUser(userData)

        cognitoUser.forgotPassword({
          onSuccess: (data) => {
            resolve(data)
          },
          onFailure: (err) => {
            reject(err)
          },
        })
      }, delay)
    })
  }

  const handleResetPassword = (email, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          Username: email,
          Pool: UserPool,
        }

        const cognitoUser = new CognitoUser(userData)

        cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess: () => {
            navigate('/auth/login')
            addLog(`Password reset.`)
            resolve()
          },
          onFailure: (err) => {
            reject(err)
          },
        })
      }, delay)
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
        handleResendVerificationCode,
        userAttributes,
        isAdmin,
        API,
        authLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
