import TopNav from './TopNav'
import WorkoutTable from './WorkoutTable'
import SideNav from './SideNav'
import Box from '@mui/material/Box'

const Root = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
      <SideNav />
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <TopNav />
        <WorkoutTable />
      </Box>
    </Box>
  )
}

export default Root
