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
    <>
      <WorkoutTopNav />
      <div className='main'>
        <WorkoutSideNav />
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </div>
    </>
  </WorkoutProvider>
)

export default WorkoutRoot
