/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import TableBody from '@mui/material/TableBody'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
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
import Workout from '../../../models/workout'
import Heading from '../components/Heading'
import TemplateToSvg from '../components/TemplateToSvg'
import DependencyToSvg from '../components/DependencyToSvg'

const MyWorkoutTables = ({ workoutsData, error, fetchWorkouts, loading }) => {
  const renderFailedStateContent = () => {
    if (error) {
      return <ErrorRow fetchWorkouts={fetchWorkouts} />
    }

    if (workoutsData.length === 0) {
      return <NoWorkouts />
    }

    return null
  }

  if (loading) return <SkeletonTable isYours />

  return (
    <StyledTableContainer>
      <StyledTable size='small'>
        <TableHead isYours />
        <TableBody>
          {workoutsData &&
            workoutsData.length > 0 &&
            workoutsData.map((workoutData, index) => {
              const workout = new Workout(workoutData)
              return (
                <StyledTableRow key={workout.id} index={index}>
                  <StyledIconTableCell align='center'>
                    <WorkoutTooltip workout={workout} />
                  </StyledIconTableCell>
                  <StyledTableCell align='left'>
                    <TextLink workout={workout} toManage />
                  </StyledTableCell>

                  <StyledIconTableCell align='center'>
                    <TemplateToSvg template={workout.spTemplate.name} />
                  </StyledIconTableCell>

                  <StyledTableCell align='center'>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      {workout.dependencies &&
                        Object.keys(workout.dependencies).length > 0 &&
                        Object.keys(workout.dependencies).map((key) => (
                          <DependencyToSvg key={key} template={key} />
                        ))}
                    </Box>
                  </StyledTableCell>

                  <StyledIconTableCell align='center'>
                    <Rating rating={workout.difficulty} />
                  </StyledIconTableCell>
                  <StyledTableCell align='center'>
                    {workout.isPublic ? 'Public' : 'Private'}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {workout.createdAt}
                  </StyledTableCell>
                  <StyledIconTableCell align='center'>
                    {workout.youtubeLink && <YouTube workout={workout} />}
                  </StyledIconTableCell>
                </StyledTableRow>
              )
            })}
        </TableBody>
      </StyledTable>
      <Box
        sx={{
          height: '100%',
        }}
      >
        {renderFailedStateContent()}
      </Box>
    </StyledTableContainer>
  )
}

export default MyWorkoutTables
