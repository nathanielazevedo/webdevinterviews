import { useContext } from 'react'
import { WorkoutContext } from '../../../contexts/WorkoutContext'
import { useNavigate, useNavigation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import {
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Tooltip,
} from '@mui/material'
import TemplateToSvg from '../../workouts/components/TemplateToSvg'
import YouTube from '../../../components/YouTubeIcon'
import Rating from '../../../components/Rating'

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
      }}
    >
      <IconButton
        color='grey.900'
        className='nav-link'
        sx={{
          borderRadius: '0',
          height: '35px',
          maxHeight: '35px',
          width: '67px',
          color: 'grey.500',
          borderRight: '0.5px solid #454950',
        }}
        onClick={() => navigate('/workouts')}
      >
        <CloseIcon />
      </IconButton>
      <TemplateToSvg template={workout.type} />
      <Typography variant='caption'>{workout.title}</Typography>
      <Rating rating={workout.difficulty} />
      <YouTube workout={workout} />
    </Box>
  )
}

export default WorkoutTopNav
