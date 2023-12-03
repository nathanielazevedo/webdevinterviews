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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
  )
}

export default WorkoutsRoot
