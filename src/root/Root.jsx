import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import TopNav from './RootTopNav'

const Root = () => (
  <AuthProvider>
    <TopNav />
    <main className='main'>
      <Outlet />
    </main>
  </AuthProvider>
)

export default Root
