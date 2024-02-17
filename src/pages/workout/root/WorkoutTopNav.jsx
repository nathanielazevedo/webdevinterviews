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
          }}
          onClick={() => navigate('/workouts')}
        >
          <CloseIcon />
        </IconButton>
        <TemplateToSvg template={workout.sp_template.name} />
        <Typography variant='caption'>{workout.title}</Typography>
        <Rating rating={workout.difficulty} />
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
    </Box>
  )
}

export default WorkoutTopNav
