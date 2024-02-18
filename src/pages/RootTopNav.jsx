import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Typography, Box, Skeleton, Divider } from '@mui/material'
import TextLink from '../components/TextLink'

const RootTopNav = () => {
  const { user, authLoading } = useContext(AuthContext)

  return (
    <div className='top-nav'>
      <Typography color='grey.500' variant='button'>
        WEB DEV INTERVIEWS
      </Typography>
      {!authLoading ? (
        user ? (
          <TextLink to='/auth/account' text={user.username} />
        ) : (
          <div className='top-nav-auth-wrapper'>
            <TextLink to='/auth/login' text='Login' />
            <Divider orientation='vertical' flexItem />
            <TextLink to='/auth/signup' text='Signup' />
          </div>
        )
      ) : (
        <Skeleton variant='text' width={100} animation='wave' />
      )}
    </div>
  )
}

export default RootTopNav
