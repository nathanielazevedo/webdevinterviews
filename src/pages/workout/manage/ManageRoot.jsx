import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import ManageTopNav from './ManageTopNav'

const ManageRoot = () => (
  <Box>
    <ManageTopNav />
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        maxHeight: '85vh',
        overflow: 'scroll',
      }}
    >
      <Outlet />
    </Box>
  </Box>
)

export default ManageRoot
