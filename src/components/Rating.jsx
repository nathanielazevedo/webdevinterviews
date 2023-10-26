import { Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  const getIcon = (rating) => {
    switch (rating) {
      case 1:
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--green)' }}
            fontWeight='bolder'
          >
            EASY
          </Typography>
        )
      case 2:
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--orange)' }}
            fontWeight='bolder'
          >
            MEDIUM
          </Typography>
        )
      case 3:
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--red)' }}
            fontWeight='bolder'
          >
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
