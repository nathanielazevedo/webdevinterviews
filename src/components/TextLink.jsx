import { Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'

const TextLink = ({ to, text, end = true, icon }) => (
  <NavLink
    end={end}
    to={to}
    className={({ isActive }) =>
      `nav-link ${isActive ? 'active' : 'not-active'}`
    }
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {icon && icon}
      <Typography sx={{ fontSize: '16px' }}>{text}</Typography>
    </div>
  </NavLink>
)

export default TextLink
