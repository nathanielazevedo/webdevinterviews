import Typography from '@mui/material/Typography'

const Header = ({ title, subtext }) => {
  return (
    <div>
      <Typography variant='h2'>{title}</Typography>
      <Typography variant='subtitle1' color={'text.secondary'}>
        {subtext}
      </Typography>
    </div>
  )
}

export default Header
