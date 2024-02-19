import TextLink from '../components/TextLink'

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
    name: 'COMPETE',
    path: 'competitions',
  },
  {
    name: 'HELP',
    path: 'help',
  },
]

const RootSideNav = ({ main }) => (
  <div style={{ width: '250px' }}>
    <ul className='drawer-links-container'>
      {links.map((link) => {
        return <TextLink text={link.name} to={link.path} />
      })}
    </ul>
  </div>
)

export default RootSideNav
