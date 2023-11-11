/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import LogoText from '../LogoText'
import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'

const TopNav = () => {
  const location = useLocation()
  console.log(location)
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '0.5px solid #454950',
      }}
    >
      <LogoText />
      <Typography variant='caption' color='grey.500' ml={'10px'}>
        {location.pathname}
      </Typography>
    </Box>
  )
}

export default TopNav
