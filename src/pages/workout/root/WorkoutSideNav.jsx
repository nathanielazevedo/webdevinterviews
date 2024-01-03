import CodeIcon from '@mui/icons-material/Code'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { useContext } from 'react'
import SideNav from '../../../components/frame/SideNav'
import { WorkoutContext } from './WorkoutContext'

const WorkoutSideNav = () => {
  const { workoutData } = useContext(WorkoutContext)

  const editorLinks = [
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${workoutData.id}`,
      end: true,
      replace: true,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon />,
      path: `/workouts/${workoutData.id}/solution`,
      replace: true,
    },
  ]

  if (workoutData.is_owner) {
    editorLinks.unshift({
      name: 'MANAGE',
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: `/workouts/${workoutData.id}/manage`,
      replace: true,
    })
  }

  return <SideNav links={editorLinks} />
}

export default WorkoutSideNav
