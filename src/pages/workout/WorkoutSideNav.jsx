import CodeIcon from '@mui/icons-material/Code'
import SideNav from '../../components/frame/SideNav'
import DetailsIcon from '@mui/icons-material/Details'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import WorkoutContext from './WorkoutContext'
import { useContext } from 'react'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)
  const editorTabs = [
    {
      name: 'DETAILS',
      icon: <DetailsIcon />,
      path: `/workouts/${workout.id}`,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${workout.id}/editor`,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon />,
      path: `/workouts/${workout.id}/solution`,
    },
  ]

  return <SideNav links={editorTabs} />
}

export default WorkoutSideNav
