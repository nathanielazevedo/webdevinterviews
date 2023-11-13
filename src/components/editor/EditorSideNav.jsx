/* eslint-disable react/prop-types */
import CodeIcon from '@mui/icons-material/Code'
import DetailsIcon from '@mui/icons-material/Details'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SideNav from '../frame/SideNav'
import { useParams } from 'react-router-dom'

const EditorSideNav = () => {
  const params = useParams()

  const editorTabs = [
    {
      name: 'DETAILS',
      icon: <DetailsIcon />,
      path: `/workouts/${params.workoutName}`,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${params.workoutName}/editor`,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon />,
      path: `/workouts/${params.workoutName}/solution`,
    },
  ]

  return <SideNav links={editorTabs} variant={'compact'} />
}

export default EditorSideNav
