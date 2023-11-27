import { useState } from 'react'
import Box from '@mui/material/Box'
import TopNav from './WorkoutsTopNav'
import WorkoutsTable from './WorkoutsTable'
import CreateWorkoutDialog from './dialogs/CreateDialog'

const WorkoutsRoot = () => {
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopNav
          open={createWorkoutDialogOpen}
          setOpenDialog={setCreateWorkoutDialogOpen}
        />
        <WorkoutsTable />
        {createWorkoutDialogOpen && (
          <CreateWorkoutDialog
            open={createWorkoutDialogOpen}
            setOpen={setCreateWorkoutDialogOpen}
          />
        )}
      </Box>
    </Box>
  )
}

export default WorkoutsRoot
