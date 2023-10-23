import { Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  const getIcon = (rating) => {
    switch (rating) {
      case 1:
        return (
          <Typography variant='caption' color='success.main'>
            EASY
          </Typography>
        )
      case 2:
        return (
          <Typography variant='caption' color='warning.main'>
            MEDIUM
          </Typography>
        )
      case 3:
        return (
          <Typography variant='caption' color='error'>
            HARD
          </Typography>
        )
      default:
        return null
    }
  }

  return getIcon(rating)
}

export default Rating
