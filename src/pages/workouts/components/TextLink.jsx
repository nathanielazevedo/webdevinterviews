/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom'

const TextLink = ({ workout }) => {
  return (
    <NavLink
      variant='subtitle'
      to={`/workouts/${workout.id}`}
      className={({ isActive, isPending }) =>
        `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
      }
      style={{
        color: 'grey.300',
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
}

export default TextLink
