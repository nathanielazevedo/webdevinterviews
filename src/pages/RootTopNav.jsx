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

const RootTopNav = () => {
  const { user, authLoading } = useContext(AuthContext)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <AppBar elevation={1}>
      <Toolbar>
        <Typography
          variant=''
          component='div'
          sx={{ flexGrow: 1, color: 'grey.300' }}
        >
          WEB DEV INTERVIEWS
        </Typography>
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
