import { useContext, useState } from 'react'
import { AuthContext } from './AuthContext'
import { Typography, Box, Skeleton, Divider, IconButton } from '@mui/material'
import TextLink from '../components/TextLink'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '../components/Drawer'

const RootTopNav = () => {
  const { user, authLoading } = useContext(AuthContext)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className='top-nav'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
        }}
      >
        <MenuIcon
          onClick={() => setDrawerOpen(true)}
          className='menu-icon'
          sx={{
            color: 'grey.500',
            ':hover': {
              backgroundColor: 'rgba(250,250,250,0.1)',
            },
          }}
        />
        <Typography color='grey.500' variant='button'>
          WEB DEV INTERVIEWS
        </Typography>
      </div>
      {!authLoading ? (
        user ? (
          <TextLink to='/auth/account' text={user.username} />
        ) : (
          <div className='top-nav-auth-wrapper'>
            <TextLink to='/auth/login' text='Login' />
            <Divider orientation='vertical' flexItem />
            <TextLink to='/auth/signup' text='Signup' />
          </div>
        )
      ) : (
        <Skeleton variant='text' width={100} animation='wave' />
      )}
      {drawerOpen && <Drawer open={drawerOpen} setOpen={setDrawerOpen} />}
    </div>
  )
}

export default RootTopNav
