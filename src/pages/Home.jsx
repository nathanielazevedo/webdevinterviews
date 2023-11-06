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
          <Box mt={'0px'}>
            <Typography variant='h3'>My goals:</Typography>
            <List>
              <ListItem>
                <Typography variant='h6'>
                  - Provide a nice in-browser code editor.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6'>
                  - React, TypeScript, Redux, React Router challenges.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6'>
                  - Realistic React component builds.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6'>
                  - Real React Interview Questions.
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
