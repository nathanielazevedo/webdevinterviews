/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom'

const TextLink = ({ workout }) => (
  <NavLink
    variant='subtitle'
    to={`/workouts/${workout.id}`}
    className={({ isActive, isPending }) =>
      `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
    }
    style={{
      color: 'blue !important',
      ':hover': {
        textDecoration: 'underline',
        color: 'primary.main',
        cursor: 'pointer !important',
      },
    }}
  >
    {workout.title}
  </NavLink>
)

export default TextLink
