import CodeIcon from '@mui/icons-material/Code'
import DetailsIcon from '@mui/icons-material/Details'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { useContext } from 'react'
import SideNav from '../../../components/frame/SideNav'
import WorkoutContext from './WorkoutContext'

const WorkoutSideNav = () => {
  const { workoutData } = useContext(WorkoutContext)

  const editorLinks = [
    // {
    //   name: 'DETAILS',
    //   icon: <DetailsIcon />,
    //   path: `/workouts/${workoutData.id}`,
    // },
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

  // Add edit link if user is the owner
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
