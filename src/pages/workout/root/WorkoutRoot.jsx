import { Outlet } from 'react-router-dom'
import WorkoutTopNav from './WorkoutTopNav'
import { WorkoutProvider } from './WorkoutContext'
import WorkoutSideNav from './WorkoutSideNav'
import {
  MiddleContent,
  OutletContainer,
  RootFrame,
} from '../../../rootStyledComponents'

const WorkoutRoot = () => (
  <WorkoutProvider>
    <RootFrame>
      <WorkoutTopNav />
      <MiddleContent>
        <WorkoutSideNav />
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </MiddleContent>
    </RootFrame>
  </WorkoutProvider>
)

export default WorkoutRoot
