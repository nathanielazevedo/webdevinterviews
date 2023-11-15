import EditorSideNav from '../../../components/editor/EditorSideNav'
import EditorTopNav from '../../../components/editor/EditorTopNav'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Fade } from '@mui/material'

const Root = () => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        flex={1}
        height={'calc(100vh - 63px)'}
        sx={{
          height: 'calc(100vh - 63px)',
          maxHeight: 'calc(100vh - 63px)',
        }}
      >
        <EditorTopNav />
        <Box
          display='flex'
          flex={1}
          height={'100%'}
          sx={{
            height: 'calc(100vh - 63px)',
            maxHeight: 'calc(100vh - 63px)',
          }}
        >
          <EditorSideNav />
          <Box flex={1}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default Root
