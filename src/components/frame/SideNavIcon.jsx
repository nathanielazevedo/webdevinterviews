/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

const SideNavIcon = ({ link, isCollapsed, isHidden }) => {
  const [isIncreasingOpacity, setIsIncreasingOpacity] = useState(false)
  useEffect(() => {
    if (isHidden) {
      setIsIncreasingOpacity(false)
    } else {
      setIsIncreasingOpacity(true)
    }
  }, [isHidden])
  return (
    <NavLink
      end
      to={link.path}
      className={({ isActive, isPending }) =>
        isActive ? 'active' : isPending ? 'pending' : 'not-active'
      }
      style={{
        textDecoration: 'none',
        opacity: isHidden ? '0' : '1',
        transition: `opacity ${
          isIncreasingOpacity ? '0.1s' : '1s'
        } ease-in-out`,
      }}
    >
      <ListItem key={link.name} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={link.onClick}
          sx={{
            px: 2.5,
            height: isCollapsed ? 40 : 48,
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'height 0.5s ease-in-out',
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
