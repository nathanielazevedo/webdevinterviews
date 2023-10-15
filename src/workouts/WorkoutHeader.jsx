/* eslint-disable react/prop-types */
import Rating from '../components/Rating'
import { useNavigate } from 'react-router-dom'
import YouTubeIcon from '@mui/icons-material/YouTube'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Typography, Box, Button, Tooltip } from '@mui/material'

const WorkoutHeader = ({ challenge, filter }) => {
  const navigate = useNavigate()

  return (
    <Box
      style={{
        padding: '10px 0 5px 17px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
      }}
    >
      <Button
        size='small'
        style={{ cursor: 'pointer' }}
        onClick={() => {
          navigate('/workouts/' + filter)
        }}
      >
        <ArrowBackIcon />
      </Button>

      <Typography
        variant='h5'
        sx={{
          fontWeight: 'bold',
        }}
      >
        {challenge.title}
      </Typography>

      <Rating rating={challenge.difficulty} />
      <Tooltip title='Watch the video' placement='top'>
        <a
          href={challenge.link}
          target='_blank'
          rel='noreferrer'
          style={{
            padding: '0',
            margin: '0',
            display: 'flex',
          }}
        >
          <YouTubeIcon
            sx={{
              color: '#FF0000',
            }}
            style={{
              fontSize: '50px',
              maxHeight: '35px',
            }}
          />
        </a>
      </Tooltip>
    </Box>
  )
}

export default WorkoutHeader
