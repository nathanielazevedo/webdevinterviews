/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material'

const Tags = ({ workout }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100px',
    }}
  >
    {workout.tags.map((tag) => (
      <Typography
        key={tag}
        variant='body2'
        component='div'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        #{tag}
      </Typography>
    ))}
  </Box>
)

export default Tags
