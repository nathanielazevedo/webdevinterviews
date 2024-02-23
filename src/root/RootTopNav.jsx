import { useContext, useState } from 'react'
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
import { useNavigate } from 'react-router'
import logo from '../assets/logo.png'
import RootSideNav from './RootSideNav'

const RootTopNav = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false)
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
            {/* <TextLink to='/contests' text='Contests' end={false} /> */}
          </div>
        </div>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => setSideNavOpen(true)}
        >
          <MenuIcon sx={{ color: 'grey.400' }} />
        </IconButton>
      </Toolbar>
      {sideNavOpen && (
        <RootSideNav open={sideNavOpen} setOpen={setSideNavOpen} />
      )}
    </AppBar>
  )
}

export default RootTopNav
