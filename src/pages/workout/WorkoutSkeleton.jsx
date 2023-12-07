import Box from '@mui/material/Box'
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
      <Box id='main-content' />
    </MiddleContent>
  </RootFrame>
)

export default WorkoutSkeleton
