import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { AuthContext } from './AuthContext'
import { StyledTopNav } from '../rootStyledComponents'

const RootTopNav = () => {
  const { user, authLoading } = useContext(AuthContext)

  return (
    <StyledTopNav>
      <Typography color='grey.500' fontWeight='bold' fontSize='12px'>
        WEB DEV INTERVIEWS
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {!authLoading ? (
        user ? (
          <NavLink
            to='/auth/account'
            className={({ isActive, isPending }) =>
              isActive ? 'active' : isPending ? 'pending' : 'not-active'
            }
          >
            <Typography sx={{ fontSize: '12px' }}>{user.username}</Typography>
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
                `nav-link ${
                  isActive ? 'active' : isPending ? 'pending' : 'not-active'
                }`
              }
            >
              <Typography component='div' sx={{ fontSize: '12px' }}>
                Login
              </Typography>
            </NavLink>
            <Divider orientation='vertical' flexItem />
            <NavLink
              to='/auth/signup'
              className={({ isActive, isPending }) =>
                `nav-link ${
                  isActive ? 'active' : isPending ? 'pending' : 'not-active'
                }`
              }
            >
              <Typography component='div' sx={{ fontSize: '12px' }}>
                Sign Up
              </Typography>
            </NavLink>
          </Box>
        )
      ) : (
        <Skeleton variant='text' width={100} animation='wave' />
      )}
    </StyledTopNav>
  )
}

export default RootTopNav
