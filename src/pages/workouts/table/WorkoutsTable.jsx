/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import Rating from '../../../components/Rating'
import WorkoutTooltip from '../components/WorkoutTooltip'
import SkeletonTable from './SkeletonTable'
import useFetch from '../../hooks/useFetch'
import YouTube from '../../../components/YouTubeIcon'
import ErrorRow from '../components/ErrorRow'
import TextLink from '../components/TextLink'
import Tags from '../components/Tags'
import {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './tableStyledComponents'
import NoWorkouts from '../components/NoWorkouts'
import TableHead from './TableHead'

const WorkoutTables = ({ tab }) => {
  const url = `/workouts/${tab}`
  const { data: workouts, loading, error, fetchData } = useFetch(url)
  console.log(workouts)

  if (loading) return <SkeletonTable />

  const fetchWorkouts = () => fetchData('/workouts')
  if (error || !workouts) return <ErrorRow fetchWorkouts={fetchWorkouts} />

  if (workouts.length === 0) return <NoWorkouts />

  return (
    <StyledTableContainer>
      <StyledTable size='small'>
        <TableHead />
        <TableBody>
          {workouts.map((workout, index) => (
            <StyledTableRow key={workout.id} index={index}>
              <StyledTableCell align='left'>
                <TextLink workout={workout} />
              </StyledTableCell>
              <StyledIconTableCell align='center'>
                <WorkoutTooltip workout={workout} />
              </StyledIconTableCell>
              <StyledIconTableCell align='center'>
                {workout.youtube_link && <YouTube workout={workout} />}
              </StyledIconTableCell>
              <StyledIconTableCell align='center'>
                {workout.filters && <Tags workout={workout} />}
              </StyledIconTableCell>
              <StyledIconTableCell align='center'>
                <Rating rating={workout.difficulty} />
              </StyledIconTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  )
}

export default WorkoutTables
