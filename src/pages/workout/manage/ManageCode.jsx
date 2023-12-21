import { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import WorkoutContext from '../root/WorkoutContext'

const ManageCode = () => {
  const { workoutData: workout } = useContext(WorkoutContext)
  const templateFile = JSON.parse(workout.dynamo_data.template)
  const solutionFile = JSON.parse(workout.dynamo_data.solution)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant='h6' sx={{ color: 'grey.400' }}>
          Template Files
        </Typography>
        {Object.keys(templateFile).map((file) => (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.700',
              padding: '10px 20px',
              margin: '10px 0px',
              borderRadius: '5px',
            }}
          >
            <Typography sx={{ fontSize: '14px' }}>{file}</Typography>
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant='h6'>Solution Files</Typography>
        {Object.keys(solutionFile).map((file) => (
          <Box
            sx={{
              border: '1px solid white',
            }}
          >
            {file}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ManageCode
