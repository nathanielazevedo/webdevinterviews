import LogoText from './LogoText'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'

export default function MiniDrawer() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <LogoText />
          </Toolbar>
        </AppBar>
      </Box>
      <Box component='main' sx={{ flexGrow: 1, p: 0, pt: 1, pb: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
