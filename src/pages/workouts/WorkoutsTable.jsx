import Box from '@mui/material/Box'
import Rating from '../../components/Rating'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import Fade from '@mui/material/Fade'
import { TableHead } from '@mui/material'
import WorkoutTooltip from './WorkoutTooltip'
import SkeletonTable from './SkeletonTable'
import useFetch from '../hooks/useFetch'
import YouTube from '../../components/YouTubeIcon'
import ErrorRow from './ErrorRow'
import TextLink from './components/TextLink'
import Tags from './Tags'
import {
  StyledTableContainer,
  StyledTable,
  StyledTableCell,
  StyledIconTableCell,
  StyledTableRow,
} from './styles/tableStyles'
import NoWorkouts from './NoWorkouts'

const WorkoutTables = () => {
  const url = '/workouts'

  const { data: workouts, loading, error, fetchData } = useFetch(url)

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        <StyledTableContainer>
          <StyledTable size='small'>
            <TableHead>
              <TableRow>
                <StyledTableCell align='left'>Name</StyledTableCell>
                <StyledIconTableCell align='center'>Info</StyledIconTableCell>
                <StyledIconTableCell align='left'>Video</StyledIconTableCell>
                <StyledIconTableCell align='center'>Tags</StyledIconTableCell>
                <StyledTableCell align='center'>Difficulty</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <SkeletonTable />
              ) : (
                workouts &&
                workouts.map((workout, index) => (
                  <StyledTableRow key={workout.name} index={index}>
                    <StyledTableCell align='left'>
                      <TextLink workout={workout} />
                    </StyledTableCell>
                    <StyledIconTableCell align='center'>
                      <WorkoutTooltip workout={workout} />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <YouTube workout={workout} />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <Tags workout={workout} />
                    </StyledIconTableCell>
                    <StyledIconTableCell align='center'>
                      <Rating rating={workout.difficulty} />
                    </StyledIconTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
        {error && (
          <ErrorRow
            fetchWorkouts={() => {
              fetchData('/workouts')
            }}
          />
        )}
        {!loading && workouts && workouts.length == 0 && <NoWorkouts />}
      </Box>
    </Fade>
  )
}

export default WorkoutTables
