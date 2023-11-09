/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import FoundationIcon from '@mui/icons-material/Foundation'
import { useLocation, useNavigate } from 'react-router-dom'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const SideNav1 = ({ drawer2Open, setDrawer2Open }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const firstPath = location.pathname.split('/')[1]
  const links = [
    {
      name: 'HOME',
      icon: <FoundationIcon />,
      path: '/home',
      onClick: () => {
        setDrawer2Open(false)
        navigate('/home')
      },
    },
    {
      name: 'WORKOUT',
      icon: <FitnessCenterIcon />,
      path: '/workouts',
      onClick:
        location.pathname.split('/')[1] === 'workouts'
          ? () => setDrawer2Open(!drawer2Open)
          : () => {
              navigate('/workouts')
              setDrawer2Open(true)
            },
    },
  ]
  return (
    <Box sx={{ width: '65px', borderRight: '0.5px solid #454950' }}>
      <List>
        {links.map((link) => (
          <ListItem key={link.name} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={link.onClick}
              sx={{
                flexDirection: 'column',
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color:
                    '/' + firstPath === link.path
                      ? 'var(--lightBlue)'
                      : 'grey.600',
                }}
              >
                {link.icon}
              </ListItemIcon>
              <Typography
                sx={{
                  fontSize: '9px',
                  color:
                    '/' + firstPath === link.path
                      ? 'var(--lightBlue)'
                      : 'grey.600',
                }}
              >
                {link.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default SideNav1
