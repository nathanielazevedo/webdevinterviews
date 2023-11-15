import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from '../components/frame/TopNav'
import SideNav from '../components/frame/SideNav'
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

// if (isDev) {
//   tabs.push({
//     name: 'ADMIN',
//     icon: <ManageAccountsIcon />,
//     path: 'admin',
//   })
// }

export default function MiniDrawer() {
  const location = useLocation()

  const showSecondNav = () => {
    if (location.pathname === '/' || location.pathname.includes('/workouts')) {
      return false
    } else {
      return true
    }
  }

  const topNavVariant = () => {
    if (location.pathname === '/') {
      return 'normal'
    } else {
      return 'collapsed'
    }
  }

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
      <TopNav variant={topNavVariant()} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: 'calc(100vh - 60px)',
          width: '100%',
        }}
      >
        <SideNav
          links={tabs}
          variant={showSecondNav() ? 'collapsed' : 'normal'}
        />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}
