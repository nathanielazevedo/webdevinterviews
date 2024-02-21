import { useContext } from 'react'
import { WorkoutContext } from '../../contexts/WorkoutContext'

import CodeIcon from '@mui/icons-material/Code'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseIcon from '@mui/icons-material/Close'

import { List } from '@mui/material'
import { NavLink } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

const WorkoutSideNav = () => {
  const { workout } = useContext(WorkoutContext)

  const links = [
    {
      name: '',
      icon: <CloseIcon />,
      path: `/workouts`,
      end: true,
      replace: true,
    },
    {
      name: 'EDITOR',
      icon: <CodeIcon />,
      path: `/workouts/${workout.id}`,
      end: true,
      replace: true,
    },
    {
      name: 'SOLUTION',
      icon: <VisibilityOutlinedIcon />,
      path: `/workouts/${workout.id}/solution`,
      replace: true,
    },
  ]

  return (
    <List className='side-nav-wrapper'>
      {links.map((link) => (
        <NavLink
          end={link.end}
          to={link.path}
          replace={link.replace}
          className={({ isActive, isPending }) =>
            isActive ? 'active' : 'not-active'
          }
          style={{ textDecoration: 'none' }}
        >
          <ListItem
            key={link.name}
            disablePadding
            sx={{
              display: 'flex',
              maxWidth: '50px',
              justifyContent: 'center',
            }}
          >
            <ListItemButton
              onClick={link.onClick}
              sx={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '0',
                  maxWidth: '50px',
                  color: 'inherit',
                }}
              >
                {link.icon}
              </ListItemIcon>
              <Typography sx={{ fontSize: '8px' }}>{link.name}</Typography>
            </ListItemButton>
          </ListItem>
        </NavLink>
      ))}
    </List>
  )
}

export default WorkoutSideNav
