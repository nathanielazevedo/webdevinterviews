import { Typography } from '@mui/material'

const Header = ({ title, subtext }) => {
  return (
    <div>
      <Typography variant='h4' color='grey.500'>
        {title}
      </Typography>
      <Typography variant='subtitle1' color='grey.300'>
        {subtext}
      </Typography>
    </div>
  )
}

export default Header
