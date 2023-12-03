/* eslint-disable react/prop-types */
import { useContext } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { AuthContext } from '../../pages/AuthContext'
import { NavLink } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'

const TopNav = () => {
  const { userAttributes, user } = useContext(AuthContext)

  return (
    <Box
      sx={{
        display: 'flex',
        height: '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // outline: '1px solid green',
        borderBottom: '0.5px solid #454950',
      }}
    >
      <>
        <Typography color='grey.500' fontWeight={'bold'} fontSize={'12px'}>
          WEB DEV INTERVIEWS
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          userAttributes ? (
            <NavLink
              to='/auth/account'
              className={({ isActive, isPending }) =>
                isActive ? 'active' : isPending ? 'pending' : 'not-active'
              }
            >
              <Typography
                sx={{
                  fontSize: '12px',
                }}
              >
                {userAttributes.nickname}
              </Typography>
            </NavLink>
          ) : (
            <Skeleton variant='text' width={100} animation='wave' />
          )
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
                `nav-link ${
                  isActive ? 'active' : isPending ? 'pending' : 'not-active'
                }`
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '12px',
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
                `nav-link ${
                  isActive ? 'active' : isPending ? 'pending' : 'not-active'
                }`
              }
            >
              <Typography
                component='div'
                sx={{
                  fontSize: '12px',
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
