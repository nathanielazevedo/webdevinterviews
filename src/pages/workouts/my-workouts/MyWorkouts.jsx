/* eslint-disable react/prop-types */
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import { useContext, useState } from 'react'
import { Box } from '@mui/material'
import { AuthContext } from '../../AuthContext'
import WorkoutsTable from '../table/WorkoutsTable'
import Unauthorized from './Unauthorized'
import CreateDialog from '../dialogs/CreateDialog'

const ManageWorkouts = () => {
  const [open, setOpen] = useState(false)
  const { user } = useContext(AuthContext)
  if (!user) return <Unauthorized />
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {user && (
          <Button
            size='small'
            startIcon={<AddIcon />}
            variant='contained'
            onClick={() => setOpen(!open)}
          >
            CREATE
          </Button>
        )}
      </Box>
      <WorkoutsTable tab='my-workouts' />
      <CreateDialog open={open} setOpen={setOpen} />
    </Box>
  )
}

export default ManageWorkouts
