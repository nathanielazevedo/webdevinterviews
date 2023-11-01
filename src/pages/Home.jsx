import { List, Typography, ListItem } from '@mui/material'
import Box from '@mui/material/Box'

const Home = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: `50px`,
          padding: '50px',
        }}
      >
        <Box>
          <Typography variant='h3'>Become a React Pro.</Typography>
          <Box mt={'50px'}>
            <Typography variant='h5'>What this site provides:</Typography>
            <List>
              <ListItem>
                <Typography variant='body1'>
                  1. A feature full in browser code editor.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body1'>
                  2. React, TypeScript, Redux, React Router challenges.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body1'>
                  3. Realistic React component builds.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body1'>
                  4. Real React Interview Questions.
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Home
