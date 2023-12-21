import { Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const Rating = ({ rating }) => {
  const getIcon = (rating) => {
    switch (rating) {
      case 'junior':
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--green)' }}
            fontWeight='bolder'
            noWrap
            width='65px'
            textAlign='center'
          >
            JUNIOR
          </Typography>
        )
      case 'mid':
        return (
          <Typography
            variant='caption'
            sx={{ color: 'var(--orange)' }}
            fontWeight='bolder'
            width='65px'
            textAlign='center'
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
            textAlign='center'
            width='65px'
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
