/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
// import { useLocation } from 'react-router-dom'

const TopNav = ({ variant }) => {
  // const location = useLocation()

  return (
    <Box
      sx={{
        display: 'flex',
        height: '35px',
        // minHeight: variant === 'hidden' ? '0' : '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '0.5px solid #454950',
        transition: 'height 0.3s ease-in-out',
      }}
    >
      <>
        <Typography
          component='div'
          color='grey.500'
          fontWeight={'bold'}
          sx={{
            fontSize: variant === 'collapsed' ? '10px' : '14px',
            transition: 'font-size 0.3s ease-in-out',
          }}
        >
          WEB DEV INTERVIEWS
        </Typography>
        {/* <Typography
          color='grey.500'
          ml={'10px'}
          sx={{
            fontSize: variant === 'collapsed' ? '10px' : '14px',
            transition: 'font-size 0.3s ease-in-out',
          }}
        >
          {location.pathname}
        </Typography> */}
      </>
    </Box>
  )
}

export default TopNav
