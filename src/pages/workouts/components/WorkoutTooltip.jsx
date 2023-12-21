/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import Tooltip from '@mui/material/Tooltip'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import { Box, Typography } from '@mui/material'
import Rating from '../../../components/Rating'

const WorkoutTooltip = ({ workout }) => {
  return (
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
          <Box
            sx={{
              width: '275px',
            }}
          >
            {workout.image_link ? (
              <img
                src={`../images/${workout.image_link}`}
                alt={workout.title}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                loading='lazy'
              />
            ) : (
              <Typography
                sx={{
                  color: 'grey.600',
                  fontSize: '15px',
                }}
              >
                No image
              </Typography>
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
  )
}

export default WorkoutTooltip
