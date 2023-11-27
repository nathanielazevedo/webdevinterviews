import { useState } from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from '../components/frame/TopNav'
import SideNav from '../components/frame/SideNav'
import AuthDialog from './AuthDialog'
import FoundationIcon from '@mui/icons-material/Foundation'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'

const tabs = [
  {
    name: 'HOME',
    icon: <FoundationIcon />,
    path: '/',
  },
  {
    name: 'WORKOUTS',
    icon: <SportsMartialArtsOutlinedIcon />,
    path: 'workouts',
  },
]

export default function MiniDrawer() {
  const location = useLocation()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        maxHeight: '100vh',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <TopNav
        isSmall={location.pathname !== '/'}
        authDialogOpen={authDialogOpen}
        setAuthDialogOpen={setAuthDialogOpen}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: 'calc(100vh - 60px)',
          width: '100%',
        }}
      >
        <SideNav links={tabs} variant={'normal'} />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
      {authDialogOpen && (
        <AuthDialog
          open={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
        />
      )}
    </Box>
  )
}
