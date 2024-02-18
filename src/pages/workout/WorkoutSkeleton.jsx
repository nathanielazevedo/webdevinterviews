import Box from '@mui/material/Box'
import { CircularProgress, Typography } from '@mui/material'
import {
  MiddleContent,
  SideNavContainer,
  StyledTopNav,
} from '../../rootStyledComponents'

const WorkoutSkeleton = () => (
  <>
    <StyledTopNav />
    <SideNavContainer />
    <Box
      id='main-content'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography variant='h3'>Loading Workout</Typography>
      <CircularProgress size='100px' />
    </Box>
  </>
)

export default WorkoutSkeleton
