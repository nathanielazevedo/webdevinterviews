import { Outlet } from 'react-router-dom'
import TopNav from './RootTopNav'

const Root = () => (
  <>
    <TopNav />
    <main className='main'>
      <Outlet />
    </main>
  </>
)

export default Root
