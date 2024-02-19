import Box from '@mui/material/Box'
import { CircularProgress, Typography } from '@mui/material'

const WorkoutSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '50px',
    }}
  >
    <Typography variant='h3'>Loading Workout</Typography>
    <CircularProgress size='100px' />
  </Box>
)

export default WorkoutSkeleton
