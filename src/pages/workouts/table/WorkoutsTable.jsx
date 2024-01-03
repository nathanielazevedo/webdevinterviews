/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import Rating from '../../../components/Rating'
import SkeletonTable from './SkeletonTable'
import useFetch from '../../hooks/useFetch'
import YouTube from '../../../components/YouTubeIcon'
import ErrorRow from '../components/ErrorRow'
import TextLink from '../components/TextLink'
import {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './tableStyledComponents'
import NoWorkouts from '../components/NoWorkouts'
import TableHead from './TableHead'
import Workout from '../../../models/workout'
import TemplateToSvg from '../components/TemplateToSvg'

const WorkoutTables = ({ tab }) => {
  const url = `/workouts/${tab}`
  const { data: workoutsData, loading, error, fetchData } = useFetch(url)

  const fetchWorkouts = () => fetchData(`/workouts/${tab}`)

  const renderTableBodyContent = () => {
    if (error || !workoutsData) {
      return null
    }

    if (workoutsData.length === 0) {
      return null
    }

    return workoutsData.map((workoutData, index) => {
      const workout = new Workout(workoutData)
      return (
        <StyledTableRow key={workout.id} index={index}>
          <StyledTableCell align='left'>
            <TextLink workout={workout} />
          </StyledTableCell>
          <StyledIconTableCell align='center'>
            <TemplateToSvg template={workout.spTemplate.name} />
          </StyledIconTableCell>
          <StyledIconTableCell align='center'>
            <Rating rating={workout.difficulty} />
          </StyledIconTableCell>
          <StyledTableCell align='center'>
            {workout.author.username}
          </StyledTableCell>
          <StyledTableCell align='center'>{workout.createdAt}</StyledTableCell>
          <StyledIconTableCell align='center'>
            {workout.youtubeLink && <YouTube workout={workout} />}
          </StyledIconTableCell>
        </StyledTableRow>
      )
    })
  }

  const renderFailedStateContent = () => {
    if (error || !workoutsData) {
      return <ErrorRow fetchWorkouts={fetchWorkouts} />
    }

    if (workoutsData.length === 0) {
      return <NoWorkouts />
    }

    return null
  }

  if (loading) return <SkeletonTable />

  return (
    <StyledTableContainer>
      <StyledTable size='small' stickyHeader>
        <TableHead />
        <TableBody>{renderTableBodyContent()}</TableBody>
      </StyledTable>
      <Box>{renderFailedStateContent()}</Box>
    </StyledTableContainer>
  )
}

export default WorkoutTables
