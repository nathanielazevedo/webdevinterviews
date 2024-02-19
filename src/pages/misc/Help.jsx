import { Box, Button, Typography } from '@mui/material'

const HelpPage = () => {
  const handleButtonClick = () => {
    window.open('https://discord.gg/wjH8W9JFY6', '_blank')
  }

  return (
    <div className='fit-wrapper'>
      <Box>
        <Typography variant='h4' sx={{}}>
          Got Bugs?
        </Typography>
        <Typography variant='h5'>
          Send a message to the discord and I will help you.
        </Typography>
      </Box>
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={handleButtonClick}
      >
        Go to Discord
      </Button>
    </div>
  )
}

export default HelpPage
