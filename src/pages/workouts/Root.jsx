/* eslint-disable react/prop-types */
import TopNav from './TopNav'
import WorkoutTable from './WorkoutTable'
import Box from '@mui/material/Box'

const Root = ({ difficulty }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <TopNav difficulty={difficulty} />
        <WorkoutTable />
      </Box>
    </Box>
  )
}

export default Root
