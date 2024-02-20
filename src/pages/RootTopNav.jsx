import { useContext, useState } from 'react'
import { AuthContext } from './AuthContext'
import {
  Typography,
  Box,
  Skeleton,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'
import TextLink from '../components/TextLink'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '../components/Drawer'
import { useNavigate } from 'react-router'
import logo from '../assets/logo.png'

const RootTopNav = () => {
  const { user, authLoading } = useContext(AuthContext)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <AppBar elevation={1}>
      <Toolbar>
        <div className='app-bar-section'>
          <img
            onClick={() => navigate('/')}
            src={logo}
            width={'40px'}
            style={{
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          />
          <div className='app-bar-links'>
            <TextLink to='/workouts' text='Workouts' end={false} />
            <TextLink to='/games' text='Games' end={false} />
          </div>
        </div>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon sx={{ color: 'grey.400' }} />
        </IconButton>
      </Toolbar>
      {drawerOpen && <Drawer open={drawerOpen} setOpen={setDrawerOpen} />}
    </AppBar>
  )
}

export default RootTopNav
