/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import { NavLink } from 'react-router-dom'

const SideNavIcon = ({ link }) => {
  return (
    <NavLink
      to={link.path}
      className={({ isActive, isPending }) =>
        isActive ? 'active' : isPending ? 'pending' : 'not-active'
      }
      style={{
        textDecoration: 'none',
      }}
    >
      <ListItem key={link.name} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={link.onClick}
          sx={{
            px: 2.5,
            minHeight: 48,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: 'grey.500',
            }}
          >
            {link.icon}
          </ListItemIcon>
          <Typography sx={{ fontSize: '9px' }}>{link.name}</Typography>
        </ListItemButton>
      </ListItem>
    </NavLink>
  )
}

export default SideNavIcon
