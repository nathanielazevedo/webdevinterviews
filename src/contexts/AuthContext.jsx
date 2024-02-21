import { useNavigate } from 'react-router-dom'
import { createContext, useState, useEffect, useContext } from 'react'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import PropTypes from 'prop-types'
import UserPool from './userpool'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const handleSession = (currentUser) =>
    new Promise((resolve, reject) => {
      currentUser.getSession((error, session) => {
        if (error) {
          reject(error)
          setLoading(false)
        } else {
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err)
            } else {
              const userAttributes = attributes.reduce((acc, attribute) => {
                acc[attribute.getName()] = attribute.getValue()
                return acc
              }, {})
              const idToken = session.getIdToken()
              setToken(idToken)
              const isAdmin = (
                idToken.payload['cognito:groups'] || []
              ).includes('admin')
              setUser({
                ...currentUser,
                username: userAttributes.nickname,
                email: userAttributes.email,
              })
              resolve(session)
              setLoading(false)
            }
          })
        }
      })
    })

  useEffect(() => {
    const currentUser = UserPool.getCurrentUser()
    if (currentUser) {
      handleSession(currentUser)
    } else {
      setLoading(false)
    }
  }, [])

  const refreshAuthToken = async () =>
    new Promise((resolve, reject) => {
      const currentUser = UserPool.getCurrentUser()
      currentUser.getSession(async (error, session) => {
        if (error) {
          reject(error)
        } else {
          const idToken = session.getIdToken()
          setToken(idToken)
          resolve()
        }
      })
    })

  const handleLogin = async (email, password) => {
    if (user) return
    const currUser = new CognitoUser({ Username: email, Pool: UserPool })
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    try {
      await new Promise((resolve, reject) => {
        currUser.authenticateUser(authDetails, {
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
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignup = (email, username, password) =>
    new Promise((resolve, reject) => {
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
        }
      })
    })

  const handleVerifyEmail = (email, code) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: UserPool,
      }

      const cognitoUser = new CognitoUser(userData)

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          if (err.code === 'CodeMismatchException') {
            reject(new Error('The provided code does not match our records.'))
          } else if (err.code === 'NotAuthorizedException') {
            reject(new Error('This email address is already verified. Login.'))
          } else if (err.code === 'ExpiredCodeException') {
            reject(new Error(err.message))
          } else {
            reject(err)
          }
          return
        }
        resolve(result)
      })
    })
  }

  const handleResendVerificationCode = (email) =>
    new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: UserPool })
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

  const handleLogout = () => {
    return new Promise((resolve, reject) => {
      const currentUser = UserPool.getCurrentUser()
      if (currentUser) {
        currentUser.signOut()
        setUser(null)
        setToken(null)
        resolve()
      } else {
        reject(new Error('No user is currently logged in'))
      }
    })
  }

  const handleDeleteAccount = () =>
    new Promise((resolve, reject) => {
      const cognitoUser = UserPool.getCurrentUser()
      if (cognitoUser) {
        cognitoUser.getSession((error) => {
          if (error) reject(error)
          else {
            cognitoUser.deleteUser((err, result) => {
              if (err) reject(err)
              else {
                setUser(null)
                navigate('/auth/signup')
                resolve(result)
              }
            })
          }
        })
      } else reject(new Error('No user is currently logged in'))
    })

  const handleForgotPassword = (email) =>
    new Promise((resolve, reject) => {
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
    })

  const handleResetPassword = (email, verificationCode, newPassword) =>
    new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: UserPool,
      }

      const cognitoUser = new CognitoUser(userData)
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          navigate('/auth/login')
          resolve()
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading: loading,
        handleLogout,
        handleLogin,
        handleSignup,
        handleVerifyEmail,
        handleDeleteAccount,
        handleForgotPassword,
        handleResetPassword,
        handleResendVerificationCode,
        refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
