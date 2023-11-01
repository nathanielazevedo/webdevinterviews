import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Outlet } from 'react-router-dom'
import FoundationIcon from '@mui/icons-material/Foundation'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const drawerWidth = 170
const drawer2Width = 150

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})
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

const Drawer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

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
  const [open, setOpen] = React.useState(false)
  const [drawer2Open, setDrawer2Open] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawer2Open = () => {
    setDrawer2Open(true)
  }

  const handleDrawer2Close = () => {
    setDrawer2Open(false)
  }

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
        location.pathname === '/workouts'
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
    // {
    //   title: 'CSS',
    //   path: '/workouts/css',
    // },
    // {
    //   title: 'HTML',
    //   path: '/workouts/html',
    // },
    // {
    //   title: 'JavaScript',
    //   path: '/workouts/javascript',
    // },
    {
      title: 'React',
      path: '/workouts/react',
    },
    {
      title: 'React Testing',
      path: '/workouts/react-testing',
    },
    {
      title: 'Redux',
      path: '/workouts/redux',
    },
    {
      title: 'React Router',
      path: '/workouts/redux',
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
      <Box variant='outlined'>
        <Toolbar variant='dense' sx={{ borderBottom: '0.5px solid #454950' }}>
          <Typography
            variant='subtitle'
            noWrap
            component='div'
            sx={{
              letterSpacing: '0.4em',
              // color: 'grey.500',
            }}
          >
            React Pro
          </Typography>
        </Toolbar>
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
        <Drawer open={open} sx={{ borderRight: '0.5px solid #454950' }}>
          <List>
            {links.map((link, index) => (
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
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: 'grey.400',
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '10px', color: 'grey.500' }}>
                    {link.name}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
            <Box sx={{ flex: 1 }}></Box>
            {/* <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  onClick={open ? handleDrawerClose : handleDrawerOpen}
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'grey.400',
                  }}
                >
                  {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={'Collapse'}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Drawer>
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
