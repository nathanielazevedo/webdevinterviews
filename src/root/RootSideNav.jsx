import TextLink from '../components/TextLink'
import Drawer from '@mui/material/Drawer'

const links = [
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
    name: 'CONTESTS',
    path: 'contests',
  },
  {
    name: 'CONTACT',
    path: 'contact',
  },
  {
    name: 'LOGIN',
    path: '/auth/login',
  },
]

const RootSideNav = ({ setOpen }) => (
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
          return <TextLink text={link.name} to={link.path} />
        })}
      </ul>
    </div>
  </Drawer>
)

export default RootSideNav
