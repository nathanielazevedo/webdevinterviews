import Box from '@mui/material/Box'
import { Fade, Typography, colors } from '@mui/material'
import { YouTube } from '@mui/icons-material'

const Home = () => (
  <Fade in timeout={1000}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        padding: '50px',
      }}
    >
      <Box>
        <Typography variant='h2'>Learn</Typography>
        <Typography variant='h5' color='grey'>
          Sharpen your web development skills in the workouts page.
        </Typography>
        <Typography
          variant='h5'
          color='grey'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          Checkout the YouTube videos!
          <a
            target='_blank'
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw'
          >
            <YouTube sx={{ color: 'red' }} fontSize='large' />
          </a>
        </Typography>
      </Box>
      <Box>
        <Typography variant='h2'>Play</Typography>
        <Typography variant='h5' color='grey'>
          Play JavaScript games in the games page.
        </Typography>
      </Box>
      <Box>
        <Typography variant='h2'>Compete</Typography>
        <Typography variant='h5' color='grey'>
          Compete against other developers for prizes in the compete page.
        </Typography>
      </Box>
      <Typography></Typography>
    </Box>
  </Fade>
)

export default Home
