/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate, useNavigation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { IconButton, Typography, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import Rating from '../../../components/Rating'
import { WorkoutContext } from './WorkoutContext'
import TemplateToSvg from '../../workouts/components/TemplateToSvg'

const WorkoutTopNav = () => {
  const { workoutData: workout } = useContext(WorkoutContext)
  const navigate = useNavigate()
  const navigation = useNavigation()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '0.5px solid #454950',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          // border: '0.5px solid #454950',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: '1',
            alignItems: 'center',
            gap: '15px',
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
              // marginRight: '13px',
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: 'grey.500',
              }}
            >
              Workout #{workout.id}:
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>{workout.title}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: 'grey.500',
              }}
            >
              Framework:
            </Typography>
            <TemplateToSvg template={workout.sp_template.name} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: 'grey.500',
              }}
            >
              Creator:
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: 'grey.100',
              }}
            >
              {workout.author.username}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {/* <Typography
              sx={{
                fontSize: '12px',
                color: 'grey.500',
              }}
            >
              Difficulty:
            </Typography> */}
            <Rating rating={workout.difficulty} />
          </Box>
          <Tooltip title='Watch the video' placement='bottom'>
            <IconButton size='small' sx={{ height: '30px', width: '30px' }}>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            pr: '20px',
          }}
        >
          {/* <Typography
            sx={{
              fontSize: '12px',
              color: 'grey.500',
            }}
          >
            Completion Status:
          </Typography> */}
          {/* <span
            style={{
              height: '10px',
              width: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              marginLeft: '5px',
            }}
          /> */}
        </Box>
      </Box>
    </Box>
  )
}

export default WorkoutTopNav
