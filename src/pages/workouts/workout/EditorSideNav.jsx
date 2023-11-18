/* eslint-disable react/prop-types */
import { useContext } from 'react'
import EditorContext from './EditorContext'
import CodeIcon from '@mui/icons-material/Code'
import DetailsIcon from '@mui/icons-material/Details'
import SideNav from '../../../components/frame/SideNav'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

const EditorSideNav = () => {
  const { workout } = useContext(EditorContext)

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

  return <SideNav links={editorTabs} variant={'compact'} />
}

export default EditorSideNav
