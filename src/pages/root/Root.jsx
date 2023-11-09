import TopNav from '../../components/frame/TopNav'
import Footer from '../../components/frame/Footer'
import SideNav1 from '../../components/frame/SideNav1'
import SideNav2 from '../../components/frame/SideNav2'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import FoundationIcon from '@mui/icons-material/Foundation'
import { useNavigate } from 'react-router-dom'

export default function MiniDrawer() {
  const [drawer2Open, setDrawer2Open] = useState(false)
  const navigate = useNavigate()
  const links = [
    {
      name: 'HOME',
      icon: <FoundationIcon />,
      path: '/home',
      onClick: () => {
        setDrawer2Open(false)
        navigate('/')
      },
    },
    {
      name: 'WORKOUT',
      icon: <FitnessCenterIcon />,
      path: '/workouts',
      onClick:
        location.pathname.split('/')[1] === 'workouts'
          ? () => setDrawer2Open(!drawer2Open)
          : () => {
              navigate('/workouts')
              setDrawer2Open(true)
            },
    },
  ]
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
        <SideNav1
          drawer2Open={drawer2Open}
          setDrawer2Open={setDrawer2Open}
          links={links}
        />
        <SideNav2 drawer2Open={drawer2Open} setDrawer2Open={setDrawer2Open} />
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
