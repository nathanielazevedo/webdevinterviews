/* eslint-disable react/prop-types */
import { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Fade, Typography } from '@mui/material'
import WorkoutContext from './root/WorkoutContext'
import Rating from '../../components/Rating'
import Workout from '../../models/workout'

const Description = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)

  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '2rem 2rem',
          height: 'calc(99vh - 250px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-start',
          }}
        >
          {/* <Typography fontWeight='bold' color='grey.600'>
            WORKOUT #{workout.id}
          </Typography> */}
          <Rating rating={workout.difficulty} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '5px',
          }}
        >
          <Typography variant='h4' fontWeight='bold'>
            {workout.title}
          </Typography>
          <Tooltip title='Watch the video' placement='bottom'>
            <a
              style={{ display: 'flex' }}
              href={workout.link}
              target='_blank'
              rel='noreferrer'
            >
              <YouTubeIcon sx={{ color: 'var(--red)', fontSize: '50px' }} />
            </a>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            border: '1px solid white',
            width: '400px',
            height: '225px',
            marginTop: '1rem',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {workout.image_link && (
            <img src={`../images/${workout.image_link}`} alt={workout.name} />
          )}
        </Box>
      </Box>
    </Fade>
  )
}

export default Description
