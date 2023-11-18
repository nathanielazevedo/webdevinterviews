import Box from '@mui/material/Box'
// import Logo from '../assets/logo.png'
import { Fade } from '@mui/material'
// import { List, Typography, ListItem } from '@mui/material'

const Home = () => {
  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ padding: '50px', width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <img src={'../images/logo.png'} alt='logo' width={'500px'} />
        </Box>
      </Box>
    </Fade>
  )
}

export default Home
