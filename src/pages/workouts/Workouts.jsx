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
import Header from '../../components/Header'

const Workouts = () => {
  const url = `/workouts`
  const { data: workoutsData, loading, error, fetchData } = useFetch(url)
  const [createWorkoutDialogOpen, setCreateWorkoutDialogOpen] = useState(false)

  const fetchWorkouts = () => fetchData(`/workouts`)

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
    <div className='fit-wrapper'>
      <Header
        title='Workouts'
        subtext='Coding challenges to sharpen your skills.'
      />
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
