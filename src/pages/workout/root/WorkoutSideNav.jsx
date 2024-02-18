import CodeIcon from '@mui/icons-material/Code'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { useContext } from 'react'
import SideNav from '../../../components/frame/SideNav'
import { WorkoutContext } from '../../../contexts/WorkoutContext'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)

  const editorLinks = [
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

  if (workout.isOwner) {
    editorLinks.unshift({
      name: 'MANAGE',
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: `/workouts/${workout.id}/manage`,
      replace: true,
    })
  }

  return <SideNav links={editorLinks} />
}

export default WorkoutSideNav
