/* eslint-disable react/prop-types */
import Tooltip from '@mui/material/Tooltip'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import { Box, Typography } from '@mui/material'
import Rating from '../../../components/Rating'

const WorkoutTooltip = ({ workout }) => {
  return (
    <Box
      sx={{
        width: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip
        title={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '275px',
              height: '250px',
            }}
          >
            <Box>
              <Typography variant='h6' component='div' sx={{ mt: 2 }}>
                {workout.title}
              </Typography>
              <Rating rating={workout.difficulty} />
            </Box>
            <Box
              sx={{
                width: '275px',
              }}
            >
              {workout.image_link && (
                <img
                  src={`../images/${workout.image_link}`}
                  alt={workout.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  loading='lazy'
                />
              )}
            </Box>
          </Box>
        }
        placement='left-start'
      >
        <PermMediaIcon
          sx={{
            color: 'grey.600',
            fontSize: '15px',
          }}
        />
      </Tooltip>
    </Box>
  )
}

export default WorkoutTooltip
