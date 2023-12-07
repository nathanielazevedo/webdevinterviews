/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import TopNav from './components/WorkoutsTopNav'
import CreateWorkoutDialog from './dialogs/CreateDialog'
import { RootFrame } from '../../rootStyledComponents'
import FilterDialog from './dialogs/FilterDialog'
import Heading from './components/Heading'

const WorkoutsRoot = () => {
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  return (
    <>
      <RootFrame>
        <TopNav open={filterDialogOpen} setOpen={setFilterDialogOpen} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            margin: '20px 20px',
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
      {filterDialogOpen && (
        <FilterDialog open={filterDialogOpen} setOpen={setFilterDialogOpen} />
      )}
    </>
  )
}

export default WorkoutsRoot
