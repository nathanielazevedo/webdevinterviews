import { Box } from '@mui/material'

const NoWorkouts = () => (
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
)

export default NoWorkouts
