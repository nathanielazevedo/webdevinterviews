import { Link } from '@mui/material'
import { NavLink } from 'react-router-dom'

const TextLink = ({ to, text, end = true, icon, target }) => (
  <Link
    component={NavLink}
    underline='hover'
    color={'text.secondary'}
    end={end}
    to={to}
    target={target ? target : ''}
    sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
    className={({ isActive }) =>
      `nav-link ${isActive ? 'active' : 'not-active'}`
    }
  >
    {icon && icon}
    {text}
  </Link>
)

export default TextLink
