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
  Menu,
  MenuItem,
  Link,
} from '@mui/material'
import { Link as routerLink } from 'react-router-dom'
import TextLink from '../components/TextLink'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router'
// import logo from '../assets/logo.png'
import logo from '../assets/letter_logo.png'
import RootSideNav from './RootSideNav'
import { AuthContext } from '../contexts/AuthContext'
import { YouTube } from '@mui/icons-material'

const RootTopNav = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const { displayName, setDisplayName } = useContext(AuthContext)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <div className='app-bar-section'>
          <img
            onClick={() => navigate('/')}
            src={logo}
            width={'70px'}
            style={{
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          />

          {/* <TextLink to='/' text='WDI' end={false} /> */}
          <div className='app-bar-links'>
            <TextLink to='/workouts' text='Workouts' end={false} />
            <TextLink to='/games' text='Games' end={false} />
            <TextLink
              to='https://www.youtube.com/@webdevinterviews'
              target='_blank'
              text='YouTube'
              end={false}
              icon={<YouTube />}
            />
          </div>
        </div>
        {!displayName ? (
          <Button
            className='display-name'
            onClick={() => {
              navigate('/new-member')
            }}
            variant='outlined'
          >
            New Members
          </Button>
        ) : (
          <>
            <Button className='display-name' onClick={handleClick}>
              {displayName}
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose()
                  setDisplayName('')
                  localStorage.removeItem('access_token')
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
        <IconButton
          className='menu-icon'
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
