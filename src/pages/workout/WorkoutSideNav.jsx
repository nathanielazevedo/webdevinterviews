import { useContext } from 'react'
import { WorkoutContext } from '../../contexts/WorkoutContext'

import CodeIcon from '@mui/icons-material/Code'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseIcon from '@mui/icons-material/Close'

import SideNav from '../../components/frame/SideNav'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)

  const editorLinks = [
    {
      name: '',
      icon: <CloseIcon />,
      path: `/workouts`,
      end: true,
      replace: true,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${workout.id}`,
      end: true,
      replace: true,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon />,
      path: `/workouts/${workout.id}/solution`,
      replace: true,
    },
  ]

  return <SideNav links={editorLinks} />
}

export default WorkoutSideNav
