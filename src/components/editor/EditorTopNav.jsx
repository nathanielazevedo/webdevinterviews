/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
// import { useLocation } from 'react-router-dom'
import { Fade, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import rows from '../../workouts/index'
import Rating from '../Rating'
import Tooltip from '@mui/material/Tooltip'

const EditorTopNav = ({ variant }) => {
  // const location = useLocation()
  const params = useParams()
  const workout = rows.find((row) => row.name === params.workoutName)

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          height: variant === 'hidden' ? '0' : '35px',
          // minHeight: variant === 'hidden' ? '0' : '35px',
          padding: '0px 20px',
          alignItems: 'center',
          borderBottom: '0.5px solid #454950',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              width: '100%',
              // justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Typography variant='caption' color='primary.main'>
              WORKOUT #{workout.id} - {workout.title}
            </Typography>
            <Tooltip
              title={
                <>
                  {workout.gif && (
                    <img
                      src={workout.gif}
                      alt={workout.name}
                      style={{ maxWidth: '200px' }}
                    />
                  )}
                </>
              }
              placement='bottom-start'
            >
              <Typography
                sx={{
                  cursor: 'default',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: 'grey.500',
                  ':hover': {
                    color: 'primary.main',
                  },
                }}
              >
                GIF
              </Typography>
            </Tooltip>
          </Box>
          <Rating rating={workout.difficulty} />
        </Box>
      </Box>
    </Fade>
  )
}

export default EditorTopNav
