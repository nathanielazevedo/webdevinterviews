/* eslint-disable react/prop-types */
import { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Checkbox, Typography } from '@mui/material'
import { WorkoutContext } from '../../pages/EditorEntrance'

const Description = () => {
  const [workoutState] = useContext(WorkoutContext)
  const { showInstructions } = workoutState

  return (
    <Box
      id='instructions'
      sx={{
        top: '0',
        gap: '1rem',
        width: '100%',
        zIndex: 100,
        display: showInstructions ? 'flex' : 'none',
        padding: '1rem',
        position: 'absolute',
        flexDirection: 'column',
        backgroundColor: '#121212',
        height: '100%',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        left: '0',
        borderRight: 'var(--color-solid-resize-bar) 0.5px solid',
        transition: 'transform 0.3s ease-in-out, left 0.3s ease-in-out',
        transform: showInstructions ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: showInstructions ? '5px 0px 5px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' fontWeight='bold'>
          {workoutState.challenge.title}
        </Typography>
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
          style={{
            maxWidth: '500px',
            // border: '15px solid black',
            borderRadius: '10px',
          }}
        />
      )}
      <Box>
        <Typography variant='h6' color='primary' fontWeight='bold'>
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
