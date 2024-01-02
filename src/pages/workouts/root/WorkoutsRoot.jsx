/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import TopNav from './WorkoutsTopNav'
import CreateWorkoutDialog from '../dialogs/CreateDialog'
import { RootFrame } from '../../../rootStyledComponents'
import Heading from '../components/Heading'

const WorkoutsRoot = () => {
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)

  return (
    <>
      <RootFrame>
        <TopNav />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            margin: '30px 30px',
          }}
        >
          <Heading />
          <Outlet />
        </Box>
      </RootFrame>
      {createWorkoutDialogOpen && (
        <CreateWorkoutDialog
          open={createWorkoutDialogOpen}
          setOpen={setCreateWorkoutDialogOpen}
        />
      )}
    </>
  )
}

export default WorkoutsRoot
