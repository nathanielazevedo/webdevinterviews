/* eslint-disable react/prop-types */
import { Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'

const TextLink = ({ workout, toManage }) => (
  <NavLink
    variant='subtitle'
    to={`/workouts/${workout.id}${toManage ? '/manage' : ''}`}
    className={({ isActive, isPending }) =>
      `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
    }
    style={{
      ':hover': {
        textDecoration: 'underline',
        color: 'primary.main',
        cursor: 'pointer !important',
      },
    }}
  >
    <Typography
      sx={{
        color: 'text.secondary',
        fontSize: '14px',
        textTransform: 'capitalize',
        ':hover': {
          textDecoration: 'underline',
          color: 'primary.main',
          cursor: 'pointer !important',
        },
      }}
    >
      {workout.title}
    </Typography>
  </NavLink>
)

export default TextLink
