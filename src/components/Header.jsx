import { Typography } from '@mui/material'

const Header = ({ title, subtext }) => {
  return (
    <div style={{ marginTop: '5px' }}>
      <Typography variant='h4' color='grey.500'>
        {title}
      </Typography>
      <Typography variant='subtitle1' color='grey.200' mt={'5px'}>
        {subtext}
      </Typography>
    </div>
  )
}

export default Header
