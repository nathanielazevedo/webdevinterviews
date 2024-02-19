import { Outlet } from 'react-router-dom'

// icons
import FoundationIcon from '@mui/icons-material/Foundation'
import SosOutlinedIcon from '@mui/icons-material/SosOutlined'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import SportsMmaIcon from '@mui/icons-material/SportsMma'

import { AuthProvider } from './AuthContext'
import TopNav from './RootTopNav'
import SideNav from '../components/frame/SideNav'
import Footer from '../components/frame/Footer'

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
  {
    name: 'GAMES',
    icon: <VideogameAssetIcon />,
    path: 'games',
  },
  {
    name: 'SHORTS',
    icon: <AppShortcutIcon />,
    path: 'shorts-editor',
  },
  {
    name: 'COMPETE',
    icon: <SportsMmaIcon />,
    path: 'competitions',
  },
]

const lastLink = {
  name: '',
  icon: <SosOutlinedIcon />,
  path: 'help',
}

const Root = () => (
  <AuthProvider>
    <TopNav />
    <main className='main'>
      <SideNav links={links} lastLink={lastLink} main={true} />
      <div className='main-container'>
        <Outlet />
      </div>
    </main>
    {/* <Footer /> */}
  </AuthProvider>
)

export default Root
