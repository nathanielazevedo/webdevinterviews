import { List, Typography, ListItem } from '@mui/material'
import Box from '@mui/material/Box'
import Logo from '../assets/logo.png'

const Home = () => {
  return (
    <Box
      sx={{
        padding: '50px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          // border: 'solid white 1px',
          height: '80vh',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <img src={Logo} alt='logo' width={'500px'} />
        <Box mt={'0px'}>
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
        </Box>
      </Box>
    </Box>
  )
}

export default Home
