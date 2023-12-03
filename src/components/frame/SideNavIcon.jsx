/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import { NavLink } from 'react-router-dom'

const SideNavIcon = ({ link, isCollapsed }) => {
  return (
    <NavLink
      end={link.name === 'DETAILS'}
      to={link.path}
      className={({ isActive, isPending }) =>
        isActive ? 'active' : isPending ? 'pending' : 'not-active'
      }
      style={{ textDecoration: 'none' }}
    >
      <ListItem
        key={link.name}
        disablePadding
        sx={{
          display: 'flex',
          maxWidth: '50px',
        }}
      >
        <ListItemButton
          onClick={link.onClick}
          sx={{
            px: 2.5,
            height: isCollapsed ? 40 : 48,
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'height 0.5s ease-in-out',
            // border: link.name == '' ? '1px solid blue' : '1px solid inherit',
            // alignSelf: link.name == '' ? 'flex-end' : '1px solid inherit',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            {link.icon}
          </ListItemIcon>
          {!isCollapsed && (
            <Typography
              sx={{
                fontSize: '8px',
                opacity: isCollapsed ? '0' : '1',
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              {link.name}
            </Typography>
          )}
        </ListItemButton>
      </ListItem>
    </NavLink>
  )
}

export default SideNavIcon
