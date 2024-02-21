import { Outlet } from 'react-router-dom'
import { WorkoutProvider } from '../../contexts/WorkoutContext'
import WorkoutTopNav from './WorkoutTopNav'
import WorkoutSideNav from './WorkoutSideNav'

const WorkoutRoot = () => (
  <WorkoutProvider>
    <div className='editor-main'>
      <WorkoutSideNav />
      <div className='editor-container'>
        <WorkoutTopNav />
        <Outlet />
      </div>
    </div>
  </WorkoutProvider>
)

export default WorkoutRoot
