import { Typography, Box } from '@mui/material'
import Rating from '../../components/Rating'
import SkeletonTable from './components/SkeletonTable'
import useFetch from '../../hooks/useFetch'
import YouTube from '../../components/YouTubeIcon'
import ErrorRow from './components/ErrorRow'
import TextLink from '../../components/TextLink'
import NoWorkouts from './components/NoWorkouts'
import Workout from '../../models/workout'
import TemplateToSvg from './components/TemplateToSvg'
import { TableHead as MuiTableHead } from '@mui/material'
import { useState } from 'react'
import WorkoutsTable from './WorkoutsTable'

const Workouts = () => {
  const url = `/workouts/official`
  const { data: workoutsData, loading, error, fetchData } = useFetch(url)
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)

  const fetchWorkouts = () => fetchData(`/workouts/official`)

  const renderTableBodyContent = () => {
    if (loading) {
      return <SkeletonTable />
    }

    if (error || !workoutsData) {
      return null
    }

    if (workoutsData.length === 0) {
      return null
    }

    return <WorkoutsTable workoutsData={workoutsData} />
  }

  const renderFailedStateContent = () => {
    if (loading) return
    if (error || !workoutsData) {
      return <ErrorRow fetchWorkouts={fetchWorkouts} />
    }

    if (workoutsData.length === 0) {
      return <NoWorkouts />
    }

    return null
  }

  return (
    <div className='workout-table-wrapper'>
      <Box>
        <Typography variant='h5' color='grey.400'>
          Workouts
        </Typography>
        <Typography variant='subtitle1' color='grey.600'>
          Coding challenges to sharpen your skills.
        </Typography>
      </Box>
      <div style={{ height: 'calc(100vh - 250px)', overflowY: 'scroll' }}>
        <table>
          <thead>
            <tr>
              <th align='center'>TYPE</th>
              <th align='left'>NAME</th>
              <th align='center'>DIFFICULTY</th>
              <th align='center'>VIDEO</th>
            </tr>
          </thead>
          <tbody>{renderTableBodyContent()}</tbody>
        </table>
      </div>
      <Box>{renderFailedStateContent()}</Box>
      {createWorkoutDialogOpen && (
        <CreateWorkoutDialog
          open={createWorkoutDialogOpen}
          setOpen={setCreateWorkoutDialogOpen}
        />
      )}
    </div>
  )
}

export default Workouts
