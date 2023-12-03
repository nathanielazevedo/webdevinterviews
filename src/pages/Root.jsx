import { Outlet } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from './RootTopNav'
import SideNav from '../components/frame/SideNav'
import FoundationIcon from '@mui/icons-material/Foundation'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import { AuthProvider } from './AuthContext'
import SosOutlinedIcon from '@mui/icons-material/SosOutlined'
import { MiddleContent, OuterBox, OutletContainer, RootFrame } from '../styled'

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
      <OuterBox>
        <RootFrame>
          <TopNav />
          <MiddleContent>
            <SideNav links={links} lastLink={lastLink} />
            <OutletContainer>
              <Outlet />
            </OutletContainer>
          </MiddleContent>
          <Footer />
        </RootFrame>
      </OuterBox>
    </AuthProvider>
  )
}

export default Root
