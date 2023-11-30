/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react'
import UserPool from '../userpool'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { useNavigate } from 'react-router-dom'
import { LogContext } from './LogContext'
const isDev = import.meta.env.DEV
const delay = isDev ? 2000 : 0

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const { addLog } = useContext(LogContext)
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
          addLog(`Logged in.`)
          const idToken = currentUser.signInUserSession.getIdToken()
          const isAdmin = (idToken.payload['cognito:groups'] || []).includes(
            'admin'
          )
          setIsAdmin(isAdmin)
        }
      })
    }
  }, [])

  const handleLogin = (email, password) => {
    // InvalidParameterException
    return new Promise((resolve, reject) => {
      setTimeout(() => {
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
      }, delay)
    })
  }

  const handleSignup = (email, username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
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
                const error = new Error('This email is already in use.')
                error.code = 'UsernameExistsException'
                reject(error)
              } else {
                reject(err)
              }
            } else {
              navigate('auth/verify-email', { state: { email } })
              addLog(`Signed up.`)
              resolve(data)
            }
          }
        )
      }, delay)
    })
  }

  const handleVerifyEmail = (email, code) => {
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = UserPool.getCurrentUser()
        if (currentUser) {
          currentUser.signOut()
          setAuthenticated(false)
          setUser(null)
          addLog(`Logged out.`)
          setIsAdmin(false)
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
                  addLog(`Account deleted.`)
                  resolve(result)
                }
              })
            }
          })
        } else {
          reject(new Error('No user is currently logged in'))
        }
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
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
