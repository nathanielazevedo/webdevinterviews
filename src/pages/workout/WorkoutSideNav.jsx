import CodeIcon from '@mui/icons-material/Code'
import DetailsIcon from '@mui/icons-material/Details'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useContext } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import SideNav from '../../components/frame/SideNav'
import WorkoutContext from './WorkoutContext'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)
  const editorLinks = [
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

  const lastLink = {
    name: '',
    icon: <EditIcon />,
    path: `/workouts/${workout.id}/edit`,
  }

  return <SideNav links={editorLinks} lastLink={lastLink} />
}

export default WorkoutSideNav
