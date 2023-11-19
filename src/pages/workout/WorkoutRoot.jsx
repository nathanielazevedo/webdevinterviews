import { useState } from 'react'
import Box from '@mui/material/Box'
import { Fade } from '@mui/material'
import EditDialog from './dialogs/EditDialog'
import EditorContext from './EditorContext'
import CodeIcon from '@mui/icons-material/Code'
import DetailsIcon from '@mui/icons-material/Details'
import SideNav from '../../components/frame/SideNav'
import { Outlet, useLoaderData } from 'react-router-dom'
import EditorTopNav from '../../components/editor/EditorTopNav'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

const WorkoutRoot = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { workout } = useLoaderData()

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

  return (
    <EditorContext.Provider value={useLoaderData()}>
      <Fade in={true} timeout={1000}>
        <Box
          flex={1}
          height={'calc(100vh - 63px)'}
          sx={{
            height: 'calc(100vh - 63px)',
            maxHeight: 'calc(100vh - 63px)',
          }}
        >
          <EditorTopNav
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
          />
          <Box
            display='flex'
            flex={1}
            height={'100%'}
            sx={{
              height: 'calc(100vh - 63px)',
              maxHeight: 'calc(100vh - 63px)',
            }}
          >
            <SideNav links={editorTabs} />
            <Box flex={1}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Fade>
      <EditDialog open={editDialogOpen} setOpen={setEditDialogOpen} />
    </EditorContext.Provider>
  )
}

export default WorkoutRoot
