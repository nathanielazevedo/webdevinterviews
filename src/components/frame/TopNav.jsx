/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { AuthContext } from '../../pages/AuthContext'
import { NavLink, useNavigate } from 'react-router-dom'

const TopNav = ({ isSmall }) => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [attributes, setAttributes] = useState({})

  useEffect(() => {
    if (user) {
      user.getUserAttributes((err, attributes) => {
        if (err) {
          console.error(err)
          return
        }

        const attrs = {}

        for (let attribute of attributes) {
          const { Name, Value } = attribute
          attrs[Name] = Value
        }

        setAttributes(attrs)
      })
    } else {
      // navigate('/auth/login')
    }
  }, [navigate, user])

  return (
    <Box
      sx={{
        display: 'flex',
        height: '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '0.5px solid #454950',
        transition: 'height 0.3s ease-in-out',
      }}
    >
      <>
        <Typography
          component='div'
          color='grey.500'
          fontWeight={'bold'}
          sx={{
            fontSize: isSmall ? '10px' : '14px',
            transition: 'font-size 0.3s ease-in-out',
          }}
        >
          WEB DEV INTERVIEWS
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <NavLink
            to='/auth/account'
            className={({ isActive, isPending }) =>
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }
          >
            <Typography
              sx={{
                fontSize: '14px',
              }}
            >
              {attributes.nickname}
            </Typography>
          </NavLink>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '110px',
            }}
          >
            <NavLink
              to='/auth/login'
              className={({ isActive, isPending }) =>
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '14px',
                }}
              >
                Login
              </Typography>
            </NavLink>
            <Typography>
              <span style={{ color: '#454950' }}>|</span>
            </Typography>
            <NavLink
              to='/auth/signup'
              className={({ isActive, isPending }) =>
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '14px',
                }}
              >
                Sign Up
              </Typography>
            </NavLink>
          </Box>
        )}
      </>
    </Box>
  )
}

export default TopNav
