/* eslint-disable react/prop-types */
import Tooltip from '@mui/material/Tooltip'
import { useLoaderData } from 'react-router-dom'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Checkbox, Typography } from '@mui/material'

const Description = () => {
  const workout = useLoaderData()

  return (
    <Box
      id='instructions'
      sx={{
        top: '0',
        gap: '1rem',
        width: '100%',
        display: 'flex',
        padding: '1rem',
        flexDirection: 'column',
        backgroundColor: '#121212',
        height: '100%',
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
          {workout.title}
        </Typography>
        <Tooltip title='Watch the video' placement='bottom'>
          <a
            style={{ display: 'flex' }}
            href={workout.link}
            target='_blank'
            rel='noreferrer'
          >
            <YouTubeIcon sx={{ color: '#FF0000', fontSize: '50px' }} />
          </a>
        </Tooltip>
      </Box>
      {workout.gif && (
        <img
          src={workout.gif}
          alt={workout.name}
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
        {workout.checkList.map((item, index) => (
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
