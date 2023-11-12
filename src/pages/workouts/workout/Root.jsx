import EditorSideNav from '../../../components/editor/EditorSideNav'
import EditorTopNav from '../../../components/editor/EditorTopNav'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'

const Root = () => {
  return (
    <Box flex={1}>
      <EditorTopNav />
      <Box display='flex' flex={1}>
        <EditorSideNav />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Root
