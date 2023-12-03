import { Box, Button, Typography } from '@mui/material'

const HelpPage = () => {
  const handleButtonClick = () => {
    window.open('https://discord.gg/CsNemcyc', '_blank')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '30px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '20px',
        }}
      >
        <Box>
          <Typography variant='h4'>Got Bugs?</Typography>
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
      </Box>
    </Box>
  )
}

export default HelpPage
