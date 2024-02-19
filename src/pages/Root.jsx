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

const Root = () => (
  <AuthProvider>
    <TopNav />
    <main className='main'>
      <Outlet />
    </main>
  </AuthProvider>
)

export default Root
