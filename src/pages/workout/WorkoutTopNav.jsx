/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate, useNavigation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { IconButton, Typography, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import Rating from '../../components/Rating'
import WorkoutTooltip from '../workouts/components/WorkoutTooltip'
import WorkoutContext from './WorkoutContext'

const WorkoutTopNav = () => {
  const { workout } = useContext(WorkoutContext)
  const navigate = useNavigate()
  const navigation = useNavigation()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '0.5px solid #454950',
        transition: 'height 0.3s ease-in-out',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <IconButton
            color='grey.900'
            className='nav-link'
            sx={{
              borderRadius: '0',
              height: '35px',
              maxHeight: '35px',
              width: '60px',
              color: 'grey.500',
              borderRight: '0.5px solid #454950',
              marginRight: '13px',
            }}
            onClick={() => navigate('/workouts')}
          >
            {navigation.state === 'loading' ? (
              <CircularProgress
                size={17}
                sx={{
                  color: 'primary',
                }}
              />
            ) : (
              <CloseIcon />
            )}
          </IconButton>
          <Typography variant='caption' mr='45px'>
            <span
              style={{
                color: 'grey',
                paddingRight: '7px',
              }}
            >
              WORKOUT #{workout.id} -
            </span>
            {workout.title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <WorkoutTooltip workout={workout} />
            <Tooltip title='Watch the video' placement='bottom'>
              <IconButton size='small'>
                <a
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  href={workout.youtube_link}
                  target='_blank'
                  rel='noreferrer'
                >
                  <YouTubeIcon sx={{ color: 'darkred' }} fontSize='small' />
                </a>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          pr: '20px',
        }}
      >
        <Rating rating={workout.difficulty} />
      </Box>
    </Box>
  )
}

export default WorkoutTopNav
