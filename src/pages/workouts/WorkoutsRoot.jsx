/* eslint-disable react/prop-types */
import { useState } from 'react'
import Box from '@mui/material/Box'
import TopNav from './WorkoutsTopNav'
import WorkoutTable from './WorkoutsTable'
import CreateDialog from './dialogs/CreateDialog'

const WorkoutsRoot = () => {
  const [open, setOpen] = useState(false)
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
        <TopNav open={open} setOpenDialog={setOpen} />
        <WorkoutTable />
        <CreateDialog open={open} setOpen={setOpen} />
      </Box>
    </Box>
  )
}

export default WorkoutsRoot
