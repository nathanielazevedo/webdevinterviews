import Box from '@mui/material/Box'
import Logo from '../assets/logo.png'
// import { List, Typography, ListItem } from '@mui/material'

const Home = () => {
  return (
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
        <img src={Logo} alt='logo' width={'500px'} />
        {/* <Box mt={'0px'}>
          <Typography
            variant='h2'
            fontWeight={'bold'}
            color={'var(--lightBlue)'}
          >
            Website Goals:
          </Typography>
          <List>
            <ListItem>
              <Typography variant='h5'>- In-browser code editor.</Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h5'>- React challenges.</Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h5'>
                - Realistic React component builds.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h5'>
                - Real React Interview Questions.
              </Typography>
            </ListItem>
          </List>
        </Box> */}
      </Box>
    </Box>
  )
}

export default Home
