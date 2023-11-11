import TopNav from '../../components/frame/TopNav'
import Footer from '../../components/frame/Footer'
import SideNav from '../../components/frame/SideNav'
// import SideNav2 from '../../components/frame/SideNav2'
import Box from '@mui/material/Box'
import { Outlet, useParams } from 'react-router-dom'
import { useState } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import FoundationIcon from '@mui/icons-material/Foundation'
import { useNavigate } from 'react-router-dom'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useLocation } from 'react-router-dom'

export default function MiniDrawer() {
  const location = useLocation()
  const params = useParams()
  console.log(params)

  const tabs = [
    {
      name: 'HOME',
      icon: <FoundationIcon />,
      path: '/',
    },
    {
      name: 'WORKOUT',
      icon: <FitnessCenterIcon />,
      path: 'workouts',
    },
  ]

  const editorTabs = [
    {
      name: 'DETAILS',
      icon: <InfoOutlinedIcon />,
      path: `/workouts/react/${params.workoutName}/details`,
    },
    {
      name: 'FILES',
      icon: <FileCopyOutlinedIcon />,
      path: `/workouts/react/${params.workoutName}/files`,
    },
    {
      name: 'SOLUTION',
      icon: <QuizOutlinedIcon />,
      path: `/workouts/react/${params.workoutName}/solution`,
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
