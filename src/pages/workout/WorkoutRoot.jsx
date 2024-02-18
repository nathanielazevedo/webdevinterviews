import { Outlet } from 'react-router-dom'
import WorkoutTopNav from './root/WorkoutTopNav'
import { WorkoutProvider } from '../../contexts/WorkoutContext'
import WorkoutSideNav from './root/WorkoutSideNav'
import { OutletContainer } from '../../rootStyledComponents'

const WorkoutRoot = () => (
  <WorkoutProvider>
    <WorkoutTopNav />
    <div className='main'>
      <WorkoutSideNav />
      <OutletContainer>
        <Outlet />
      </OutletContainer>
    </div>
  </WorkoutProvider>
)

export default WorkoutRoot
