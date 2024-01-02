/* eslint-disable react/prop-types */
import { useState } from 'react'
import Button from '@mui/material/Button'
import { Box, Skeleton } from '@mui/material'
import WorkoutsTable from '../table/WorkoutsTable'
import Unauthorized from './Unauthorized'
import CreateDialog from '../dialogs/CreateDialog'
import useFetch from '../../hooks/useFetch'
import SkeletonTable from '../table/SkeletonTable'
import { GET_DEPENDENCIES } from '../../../quieres'

const ManageWorkouts = () => {
  const [open, setOpen] = useState(false)
  const {
    data: templateData,
    loading: loadingTemplates,
    error: loadingTemplatesError,
  } = useFetch(GET_DEPENDENCIES)

  if (loadingTemplates) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Skeleton variant='rectangular' width={130} height={25} />
        </Box>
        <SkeletonTable />
      </>
    )
  }

  if (loadingTemplatesError) {
    if (loadingTemplatesError.status === 401) {
      return <Unauthorized />
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          size='small'
          disabled={loadingTemplatesError || loadingTemplatesError}
          variant='outlined'
          onClick={() => setOpen(!open)}
        >
          CREATE WORKOUT
        </Button>
      </Box>
      <WorkoutsTable tab='your-workouts' />
      {open && !loadingTemplates && (
        <CreateDialog
          open={open}
          setOpen={setOpen}
          data={templateData}
          loading={loadingTemplates}
          error={loadingTemplatesError}
        />
      )}
    </Box>
  )
}

export default ManageWorkouts
