import { Typography } from '@mui/material'

const Rating = ({ rating }) => {
  switch (rating) {
    case 'junior':
      return (
        <Typography variant='subtitle2' color='success.light' noWrap>
          JUNIOR
        </Typography>
      )
    case 'mid-level':
      return (
        <Typography variant='subtitle2' color='warning.light' noWrap>
          MID-LEVEL
        </Typography>
      )
    case 'senior':
      return (
        <Typography variant='subtitle2' color='error.light' noWrap>
          SENIOR
        </Typography>
      )
    default:
      return null
  }
}

export default Rating
