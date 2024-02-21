import { Typography } from '@mui/material'

const Rating = ({ rating }) => {
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

export default Rating
