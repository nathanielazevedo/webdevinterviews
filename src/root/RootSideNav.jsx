import TextLink from '../components/TextLink'
import { useContext } from 'react'
import Drawer from '@mui/material/Drawer'
import { AuthContext } from '../contexts/AuthContext'
import { Button, Typography } from '@mui/material'

const links = [
  {
    name: 'HOME',
    path: '',
  },
  {
    name: 'WORKOUTS',
    path: 'workouts',
  },
  {
    name: 'GAMES',
    path: 'games',
  },
  {
    name: 'SHORTS EDITOR',
    path: 'shorts-editor',
  },
  {
    name: 'CONTACT',
    path: 'contact',
  },
]

const RootSideNav = ({ setOpen }) => {
  const { displayName, setDisplayName } = useContext(AuthContext)
  if (!displayName) {
    if (links[0].name !== 'NEW MEMBER') {
      links.unshift({
        name: 'NEW MEMBER',
        path: 'new-member',
      })
    }
  }

  return (
    <Drawer
      anchor='right'
      open
      onClose={() => setOpen(false)}
      elevation={1}
      onClick={() => setOpen(false)}
    >
      <div style={{ width: '250px' }}>
        <ul className='drawer-links-container'>
          {links.map((link) => {
            return (
              <TextLink
                key={link.name}
                text={link.name}
                to={link.path}
                end={false}
              />
            )
          })}
          {displayName && (
            <>
              <Typography>{displayName}</Typography>
              <Button
                variant='outlined'
                sx={{ width: '150px' }}
                onClick={() => {
                  setDisplayName('')
                  localStorage.removeItem('access_token')
                }}
              >
                Logout
              </Button>
            </>
          )}
        </ul>
      </div>
    </Drawer>
  )
}

export default RootSideNav
