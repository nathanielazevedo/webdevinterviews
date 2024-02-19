import { Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'

const TextLink = ({ to, text }) => (
  <NavLink
    end
    to={to}
    className={({ isActive, isPending }) =>
      `nav-link ${isActive ? 'active' : isPending ? 'pending' : 'not-active'}`
    }
  >
    <Typography sx={{ fontSize: '16px' }}>{text}</Typography>
  </NavLink>
)

export default TextLink
