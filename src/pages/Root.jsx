import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from '../components/frame/TopNav'
import SideNav from '../components/frame/SideNav'
import FoundationIcon from '@mui/icons-material/Foundation'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import { AuthProvider } from './AuthContext'
import SosOutlinedIcon from '@mui/icons-material/SosOutlined'

const links = [
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

const lastLink = {
  name: '',
  icon: <SosOutlinedIcon />,
  path: 'help',
}

const Root = () => {
  return (
    <AuthProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Box
          sx={{
            outline: '0.5px solid var(--divider)',
            backgroundColor: '#121212',
            borderRadius: '10px',
            width: '99vw',
            height: '99vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TopNav />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
            }}
          >
            <SideNav links={links} lastLink={lastLink} />
            <Box
              sx={{
                // outline: '1px solid green',
                flexGrow: 1,
              }}
            >
              <Outlet />
            </Box>
          </Box>

          <Footer />
        </Box>
      </Box>
    </AuthProvider>
  )
}

export default Root
