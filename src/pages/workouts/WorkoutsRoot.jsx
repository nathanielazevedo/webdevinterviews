import { useState } from 'react'
import TopNav from './WorkoutsTopNav'
import WorkoutsTable from './WorkoutsTable'
import CreateWorkoutDialog from './dialogs/CreateDialog'
import { RootFrame } from '../../styled'

const WorkoutsRoot = () => {
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)
  return (
    <>
      <RootFrame>
        <TopNav
          open={createWorkoutDialogOpen}
          setOpenDialog={setCreateWorkoutDialogOpen}
        />
        <WorkoutsTable />
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
