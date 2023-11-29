import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from '../components/frame/TopNav'
import SideNav from '../components/frame/SideNav'
import FoundationIcon from '@mui/icons-material/Foundation'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import { AuthProvider } from './AuthContext'

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

  return (
    <AuthProvider>
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
        <TopNav isSmall={location.pathname !== '/'} />
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
      </Box>
    </AuthProvider>
  )
}
