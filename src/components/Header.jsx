import { Typography } from '@mui/material'

const Header = ({ title, subtext }) => {
  return (
    <div>
      <Typography variant='h5' color='grey.300'>
        {title}
      </Typography>
      <Typography variant='subtitle1' color='grey.500'>
        {subtext}
      </Typography>
    </div>
  )
}

export default Header
