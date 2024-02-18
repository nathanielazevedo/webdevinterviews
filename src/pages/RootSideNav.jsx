// icons
import FoundationIcon from '@mui/icons-material/Foundation'
import SosOutlinedIcon from '@mui/icons-material/SosOutlined'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import SportsMmaIcon from '@mui/icons-material/SportsMma'

import SideNav from '../components/frame/SideNav'

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

const RootSideNav = ({ main }) => (
  <SideNav links={links} lastLink={lastLink} main={main} />
)

export default RootSideNav
