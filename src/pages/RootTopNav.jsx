import React from 'react'
import { NavLink } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { AuthContext } from '../pages/AuthContext'
import { StyledTopNav } from '../styled'

const RootTopNav = () => {
  const { userAttributes, user } = React.useContext(AuthContext)

  return (
    <StyledTopNav>
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
    </StyledTopNav>
  )
}

export default RootTopNav
