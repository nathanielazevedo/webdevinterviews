/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'

const ErrorRow = ({ fetchWorkouts }) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      color: 'grey.500',
      flexDirection: 'column',
      gap: '20px',
    }}
  >
    <Typography sx={{ color: 'red' }}>ERROR LOADING WORKOUTS</Typography>
    <Button variant='contained' onClick={fetchWorkouts}>
      Try Again
    </Button>
  </Box>
)

export default ErrorRow
