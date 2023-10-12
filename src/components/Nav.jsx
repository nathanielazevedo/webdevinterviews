// import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
// import IconButton from '@mui/material/IconButton'
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
// import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { NavLink, Outlet } from 'react-router-dom'
// import NotificationsIcon from '@mui/icons-material/Notifications'
// import Badge from '@mui/material/Badge'
// import AccountCircle from '@mui/icons-material/AccountCircle'
import Slide from '@mui/material/Slide'
import useScrollTrigger from '@mui/material/useScrollTrigger'

const drawerWidth = 190
const navIcons = [<FitnessCenterIcon key='1' />]

const navRoutes = ['/home', '/workouts', '/bug-bounties']

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
  width: `calc(${theme.spacing(1)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(1)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
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

function HideOnScroll(props) {
  // eslint-disable-next-line react/prop-types
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}

export default function MiniDrawer(props) {
  // const theme = useTheme()
  // const [open, setOpen] = React.useState(false)

  // const handleDrawerOpen = () => {
  //   setOpen(true)
  // }

  // const handleDrawerClose = () => {
  //   setOpen(false)
  // }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar open={false}>
          <Toolbar>
            {/* <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <ChevronRightIcon />
            </IconButton> */}
            <Typography
              variant='h6'
              noWrap
              component='div'
              fontFamily={'Bai Jamjuree'}
            >
              WEB
              <span
                style={{
                  color: 'black',
                  border: 'solid #19e4ff 1px',
                  borderRadius: '10px',
                  padding: '0 5px',
                  margin: '0 5px',
                  backgroundColor: '#19e4ff',
                }}
              >
                DEV
              </span>
              INTERVIEWS
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size='large'
                aria-label='show 17 new notifications'
                color='inherit'
              >
                <Badge badgeContent={0} color='error'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                aria-haspopup='true'
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </Box> */}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer variant='permanent' open={false}>
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        <Divider />
        <List>
          {['Workout'].map((text) => (
            <NavLink
              key={text}
              to={navRoutes[1]}
              style={({ isActive }) => {
                return {
                  color: isActive ? '#19e4ff' : 'white',
                  textDecoration: 'none',
                }
              }}
            >
              {({ isActive }) => (
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? '#19e4ff' : 'white',
                        minWidth: 0,
                        mr: open ? 0 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {navIcons[1]}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          ))}
        </List>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  )
}