import { Outlet } from 'react-router-dom'
import WorkoutTopNav from './root/WorkoutTopNav'
import { WorkoutProvider } from '../../contexts/WorkoutContext'
import WorkoutSideNav from './root/WorkoutSideNav'

const WorkoutRoot = () => (
  <WorkoutProvider>
    <WorkoutTopNav />
    <div className='main'>
      <WorkoutSideNav />
      <div className='editor-container'>
        <Outlet />
      </div>
    </div>
  </WorkoutProvider>
)

export default WorkoutRoot
