import * as React from 'react'
import LogoText from './LogoText'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { Outlet } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import FoundationIcon from '@mui/icons-material/Foundation'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const drawerWidth = 170
const drawer2Width = 150

const openedMixin2 = (theme) => ({
  width: drawer2Width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin2 = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `0`,
  [theme.breakpoints.up('sm')]: {
    width: `0`,
  },
})

const Drawer2 = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin2(theme),
    '& .MuiDrawer-paper': openedMixin2(theme),
  }),
  ...(!open && {
    ...closedMixin2(theme),
    '& .MuiDrawer-paper': closedMixin2(theme),
  }),
}))

export default function MiniDrawer() {
  const [drawer2Open, setDrawer2Open] = React.useState(false)
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

  const filters = [
    {
      title: 'All',
      path: '/workouts',
    },
    {
      title: 'React',
      path: '/workouts/react',
    },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
      }}
    >
      {/* TopNav ----------------------------*/}

      <Box
        sx={{
          borderBottom: '0.5px solid #454950',
          justifyContent: 'flex-start',
          alignItems: 'center',
          display: 'flex',
          padding: '0px 20px',
          minHeight: '35px',
        }}
      >
        <Box>
          <LogoText />
        </Box>
      </Box>

      {/* Body ----------------------------*/}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          // border: 'solid white 1px',
        }}
      >
        {/* SideNav ----------------------------*/}
        <Box sx={{ width: '65px', borderRight: '0.5px solid #454950' }}>
          <List>
            {links.map((link) => (
              <ListItem
                key={link.name}
                disablePadding
                sx={{ display: 'block' }}
              >
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
        <Drawer2 open={drawer2Open} sx={{ borderRight: '0.5px solid #454950' }}>
          <List>
            {filters.map((filter) => (
              <ListItem
                key={filter.title}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  onClick={() => {
                    navigate(filter.path)
                    setDrawer2Open(true)
                  }}
                  sx={{
                    minHeight: 38,
                    justifyContent: drawer2Open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <Typography
                    sx={{
                      opacity: drawer2Open ? 1 : 0,
                      fontSize: '14px',
                      color:
                        location.pathname.split('/').pop() === 'workouts' &&
                        filter.title === 'All'
                          ? 'inherit'
                          : filter.title.toLowerCase() ===
                            location.pathname.split('/').pop()
                          ? 'inherit'
                          : 'grey.600',
                    }}
                  >
                    {filter.title}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer2>
        {/* Outlet ----------------------------*/}
        <Outlet />
      </Box>

      {/* Footer ----------------------------*/}
      <Box
        sx={{
          borderTop: '0.5px solid #454950',
          height: '25px',
        }}
      ></Box>
    </Box>
  )
}
