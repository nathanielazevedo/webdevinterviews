/* eslint-disable react/prop-types */
import { useState } from 'react'
import Button from '@mui/material/Button'
import { Box, Skeleton } from '@mui/material'
import MyWorkoutsTable from '../table/MyWorkoutsTable'
import Unauthorized from './Unauthorized'
import CreateDialog from '../dialogs/CreateDialog'
import useFetch from '../../hooks/useFetch'
import SkeletonTable from '../table/SkeletonTable'
import { GET_DEPENDENCIES } from '../../../quieres'

const ManageWorkouts = () => {
  const [open, setOpen] = useState(false)
  const url = '/workouts/your-workouts'
  const { data: workoutsData, loading, error, fetchData } = useFetch(url)
  const {
    data: templateData,
    loading: loadingTemplates,
    error: loadingTemplatesError,
  } = useFetch(GET_DEPENDENCIES)

  const fetchWorkouts = () => fetchData('/workouts/your-workouts')
  if (loading) {
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

  if (error) {
    if (error.status === 401) {
      return <Unauthorized />
    }
  }

  return (
    <Box>
      <Box
        id='your-workouts-above-table'
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          size='small'
          disabled={error || loadingTemplatesError}
          variant='outlined'
          onClick={() => setOpen(!open)}
        >
          CREATE WORKOUT
        </Button>
      </Box>
      <MyWorkoutsTable
        workoutsData={workoutsData}
        error={error}
        fetchWorkouts={fetchWorkouts}
        loading={loading}
      />
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
