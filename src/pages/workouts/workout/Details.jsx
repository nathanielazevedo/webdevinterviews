/* eslint-disable react/prop-types */
import Tooltip from '@mui/material/Tooltip'
import { useLoaderData } from 'react-router-dom'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Checkbox, Typography } from '@mui/material'
import Rating from '../../../components/Rating'

const Description = () => {
  const workout = useLoaderData()

  return (
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
    </Box>
  )
}

export default Description
