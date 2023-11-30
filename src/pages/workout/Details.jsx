/* eslint-disable react/prop-types */
import { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import WorkoutContext from './WorkoutContext'
import Rating from '../../components/Rating'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Fade, Typography } from '@mui/material'

const Description = () => {
  const { workout } = useContext(WorkoutContext)

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '2rem 2rem',
          height: 'calc(100vh - 97px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-end',
          }}
        >
          <Typography fontWeight={'bold'} color='grey.600'>
            WORKOUT #{workout.id}
          </Typography>
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
            justifyContent: 'space-evenly',
            paddingTop: '20px',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {workout.image_link && (
            <img
              src={workout.image_link}
              alt={workout.name}
              style={{
                maxWidth: '500px',
                borderRadius: '10px',
              }}
            />
          )}
        </Box>
      </Box>
    </Fade>
  )
}

export default Description
