import { Typography } from '@mui/material'

const Rating = ({ rating }) => {
  switch (rating) {
    case 'junior':
      return (
        <Typography variant='caption' color='success.light'>
          JUNIOR
        </Typography>
      )
    case 'mid-level':
      return (
        <Typography variant='caption' color='warning.light'>
          MID-LEVEL
        </Typography>
      )
    case 'senior':
      return (
        <Typography variant='caption' color='error.light'>
          SENIOR
        </Typography>
      )
    default:
      return null
  }
}

export default Rating
