import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
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
