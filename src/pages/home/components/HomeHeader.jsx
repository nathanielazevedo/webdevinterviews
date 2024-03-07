import { Typography } from '@mui/material'

const HomeHeader = ({ title, subtext }) => {
  return (
    <>
      <Typography variant='h2'>{title}</Typography>
      <Typography variant='h6' color={'text.secondary'} textAlign={'left'}>
        {subtext}
      </Typography>
    </>
  )
}

export default HomeHeader
