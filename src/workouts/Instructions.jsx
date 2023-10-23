/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { WorkoutContext } from './Workout'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Tooltip from '@mui/material/Tooltip'

const Description = () => {
  const [workoutState, setWorkoutState] = useContext(WorkoutContext)
  const { showInstructions } = workoutState

  return (
    <Box
      id='instructions'
      sx={{
        top: '35px',
        gap: '1rem',
        width: '500px',
        zIndex: 100,
        display: 'flex',
        padding: '1rem',
        position: 'absolute',
        flexDirection: 'column',
        backgroundColor: 'grey.900',
        height: 'calc(100% - 35px)',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        left: showInstructions ? 0 : '-35%',
        borderRight: 'var(--color-solid-resize-bar) 0.5px solid',
        transition: 'transform 0.3s ease-in-out, left 0.3s ease-in-out',
        transform: showInstructions ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: showInstructions ? '5px 0px 5px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() =>
            setWorkoutState((prev) => ({ ...prev, showInstructions: false }))
          }
        >
          <CloseIcon />
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4'>{workoutState.challenge.title}</Typography>
        <Tooltip title='Watch the video' placement='bottom'>
          <a
            style={{ display: 'flex' }}
            href={workoutState.challenge.link}
            target='_blank'
            rel='noreferrer'
          >
            <YouTubeIcon sx={{ color: '#FF0000', fontSize: '50px' }} />
          </a>
        </Tooltip>
      </Box>
      {workoutState.challenge.gif && (
        <img
          src={workoutState.challenge.gif}
          alt={workoutState.challenge.name}
          style={{ maxWidth: '300px' }}
        />
      )}
      {/* <Typography>{workoutState.challenge.description}</Typography> */}
      <Box>
        <Typography variant='h6' color='primary'>
          Checklist
        </Typography>
        {workoutState.challenge.checkList.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Checkbox />
            <Typography key={index} variant='body1'>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Description
