import Box from '@mui/material/Box'
import { useLocation } from 'react-router-dom'
import Footer from '../components/frame/Footer'
import TopNav from '../components/frame/TopNav'
import CodeIcon from '@mui/icons-material/Code'
import SideNav from '../components/frame/SideNav'
import { Outlet, useParams } from 'react-router-dom'
import FoundationIcon from '@mui/icons-material/Foundation'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

export default function MiniDrawer() {
  const location = useLocation()
  const params = useParams()

  const tabs = [
    {
      name: 'HOME',
      icon: <FoundationIcon />,
      path: '/',
    },
    {
      name: 'WORKOUTS',
      icon: <FitnessCenterIcon />,
      path: 'workouts',
    },
  ]

  const editorTabs = [
    {
      name: 'DETAILS',
      icon: <InfoOutlinedIcon />,
      path: `/workouts/${params.workoutName}/details`,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${params.workoutName}/editor`,
    },
    {
      name: 'SOLUTION',
      icon: <QuizOutlinedIcon />,
      path: `/workouts/${params.workoutName}/solution`,
    },
  ]

  const showSecondNav = () => {
    if (location.pathname === '/' || location.pathname === '/workouts') {
      return false
    } else {
      return true
    }
  }

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
        <SideNav links={tabs} />
        {showSecondNav() && <SideNav links={editorTabs} />}
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}
