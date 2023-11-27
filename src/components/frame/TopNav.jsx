/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import { Typography, IconButton } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const TopNav = ({ isSmall, authDialogOpen, setAuthDialogOpen }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '35px',
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
            fontSize: isSmall ? '10px' : '14px',
            transition: 'font-size 0.3s ease-in-out',
          }}
        >
          WEB DEV INTERVIEWS
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={() => setAuthDialogOpen(!authDialogOpen)}
          sx={{
            borderRadius: '50%',
            padding: '0px',
            transition: 'font-size 0.3s ease-in-out',
          }}
        >
          <AccountCircleIcon
            sx={{
              fontSize: isSmall ? '15px' : '20px',
              transition: 'font-size 0.3s ease-in-out',
            }}
          />
        </IconButton>
      </>
    </Box>
  )
}

export default TopNav
