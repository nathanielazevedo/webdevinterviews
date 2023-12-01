import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Rating from '../../components/Rating'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Fade from '@mui/material/Fade'
import { TableHead } from '@mui/material'
import WorkoutTooltip from './WorkoutTooltip'
import SkeletonTable from './SkeletonTable'
import useFetch from '../hooks/useFetch'
import { styled } from '@mui/material/styles'
import YouTube from '../../components/YouTubeIcon'
import TextLink from './components/TextLink'

const StyledTableContainer = styled(TableContainer)({
  width: '100%',
  padding: '10px 20px',
})

const StyledTable = styled(Table)({
  '& .MuiTableCell-head': {
    lineHeight: '25px',
    color: 'grey',
    border: 0,
    fontSize: '14px',
  },
  '& .MuiTableCell-body': {
    lineHeight: '25px',
    color: 'grey',
    fontSize: '14px',
  },
})

const StyledTableCell = styled(TableCell)(() => ({
  boxSizing: 'border-box',
  width: '20px',
  minWidth: '20px',
  maxWidth: '20px',
}))

const StyledTableCellWithPadding = styled(TableCell)(() => ({
  boxSizing: 'border-box',
  paddingLeft: '23px',
  width: '100px',
  minWidth: '100px',
  maxWidth: '100px',
}))

const WorkoutTables = () => {
  const { data: workouts, loading, error } = useFetch('/workouts')

  if (error) {
    return <div>Error loading workouts</div>
  }

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        <StyledTableContainer>
          <StyledTable size='small'>
            <TableHead>
              <TableRow>
                <StyledTableCell align='left' />
                <StyledTableCellWithPadding align='left'>
                  Name
                </StyledTableCellWithPadding>
                <StyledTableCell align='left'>Video</StyledTableCell>
                <StyledTableCell align='left'>Difficulty</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <SkeletonTable />
              ) : (
                workouts &&
                workouts.map((workout, index) => (
                  <TableRow
                    key={workout.name}
                    sx={{
                      width: '100%',
                      background: index % 2 === 0 ? '#1a1a1a' : '#121212',
                      td: { border: '0' },
                    }}
                  >
                    <StyledTableCell align='left'>
                      <WorkoutTooltip workout={workout} />
                    </StyledTableCell>
                    <TableCell align='left' sx={{ paddingLeft: '0px' }}>
                      <TextLink workout={workout} />
                    </TableCell>
                    <TableCell align='left'>
                      <YouTube workout={workout} />
                    </TableCell>
                    <TableCell align='left' sx={{ width: '150px' }}>
                      <Rating rating={workout.difficulty} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
        {!loading && workouts.length == 0 && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              color: 'grey.500',
            }}
          >
            No workouts found.
          </Box>
        )}
      </Box>
    </Fade>
  )
}

export default WorkoutTables
