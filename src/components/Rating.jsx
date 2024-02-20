import { Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  const getIcon = () => {
    switch (rating) {
      case 'junior':
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--green)' }}
            fontWeight='bolder'
            noWrap
          >
            JUNIOR
          </Typography>
        )
      case 'mid-level':
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--orange)' }}
            fontWeight='bolder'
            noWrap
          >
            MID-LEVEL
          </Typography>
        )
      case 'senior':
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--red)' }}
            fontWeight='bolder'
            noWrap
          >
            SENIOR
          </Typography>
        )
      default:
        return null
    }
  }

  return getIcon(rating)
}

export default Rating
