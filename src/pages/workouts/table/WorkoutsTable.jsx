/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import { Typography, Box } from '@mui/material'
import Rating from '../../../components/Rating'
import SkeletonTable from './SkeletonTable'
import useFetch from '../../../hooks/useFetch'
import YouTube from '../../../components/YouTubeIcon'
import ErrorRow from '../components/ErrorRow'
import TextLink from '../../../components/TextLink'
import {
  StyledTableContainer,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './tableStyledComponents'
import NoWorkouts from '../components/NoWorkouts'
import Workout from '../../../models/workout'
import TemplateToSvg from '../components/TemplateToSvg'
import { TableHead as MuiTableHead } from '@mui/material'
import { useState } from 'react'

const WorkoutTables = () => {
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

    return workoutsData.map((workoutData, index) => {
      const workout = new Workout(workoutData)
      return (
        <tr key={workout.id}>
          <td align='left' width={'100px'}>
            <TemplateToSvg template={workout.spTemplate.name} />
          </td>
          <td align='left'>
            <TextLink to={`/workouts/${workout.id}`} text={workout.title} />
          </td>
          <td align='center'>
            <Rating rating={workout.difficulty} />
          </td>
          <td align='center'>
            {workout.youtubeLink && <YouTube workout={workout} />}
          </td>
        </tr>
      )
    })
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
      <table size='small'>
        <tr>
          <th align='center'>TYPE</th>
          <th align='left'>NAME</th>
          <th align='center'>DIFFICULTY</th>
          <th align='center'>VIDEO</th>
        </tr>
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

export default WorkoutTables
