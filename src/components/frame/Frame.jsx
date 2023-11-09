import TopNav from './TopNav'
import Footer from './Footer'
import SideNav1 from './SideNav1'
import SideNav2 from './SideNav2'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export default function MiniDrawer() {
  const [drawer2Open, setDrawer2Open] = useState(false)
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        maxHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <TopNav />
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <SideNav1 drawer2Open={drawer2Open} setDrawer2Open={setDrawer2Open} />
        <SideNav2 drawer2Open={drawer2Open} setDrawer2Open={setDrawer2Open} />
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
