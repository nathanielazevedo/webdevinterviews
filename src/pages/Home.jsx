import Box from '@mui/material/Box'
import { Fade } from '@mui/material'

const Home = () => (
  <Fade in timeout={1000}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <img src='../images/logo.png' alt='logo' width='40%' />
    </Box>
  </Fade>
)

export default Home
