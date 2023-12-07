import { Outlet } from 'react-router-dom'
import FoundationIcon from '@mui/icons-material/Foundation'
import SosOutlinedIcon from '@mui/icons-material/SosOutlined'
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined'
import TopNav from './RootTopNav'
import { AuthProvider } from './AuthContext'
import Footer from '../components/frame/Footer'
import SideNav from '../components/frame/SideNav'
import {
  MiddleContent,
  OuterBox,
  OutletContainer,
  RootFrame,
} from '../rootStyledComponents'

const links = [
  {
    name: 'HOME',
    icon: <FoundationIcon />,
    path: '/',
  },
  {
    name: 'WORKOUTS',
    icon: <SportsMartialArtsOutlinedIcon />,
    path: 'workouts/official',
  },
]

const lastLink = {
  name: '',
  icon: <SosOutlinedIcon />,
  path: 'help',
}

const Root = () => (
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

export default Root
