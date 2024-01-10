import Box from '@mui/material/Box'
import { CircularProgress, Typography } from '@mui/material'
import {
  MiddleContent,
  RootFrame,
  SideNavContainer,
  StyledTopNav,
} from '../../rootStyledComponents'

const WorkoutSkeleton = () => (
  <RootFrame>
    <StyledTopNav />
    <MiddleContent>
      <SideNavContainer />
      <Box
        id='main-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '20px',
        }}
      >
        <Typography
          variant='h3'
          sx={{ marginBottom: '40px', color: 'grey.400' }}
        >
          Loading Workout
        </Typography>
        <CircularProgress size='100px' />
      </Box>
    </MiddleContent>
  </RootFrame>
)

export default WorkoutSkeleton
