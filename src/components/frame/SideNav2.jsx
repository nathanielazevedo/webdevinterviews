/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'

const drawerWidth = 170
const drawer2Width = 130

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
    ...openedMixin2(theme),
    '& .MuiDrawer-paper': openedMixin2(theme),
  }),
  ...(!open && {
    ...closedMixin2(theme),
    '& .MuiDrawer-paper': closedMixin2(theme),
  }),
}))

const SideNav2 = ({ drawer2Open, setDrawer2Open }) => {
  const navigate = useNavigate()
  return (
    <Drawer open={drawer2Open} sx={{ borderRight: '0.5px solid #454950' }}>
      <List>
        {filters.map((filter) => (
          <ListItem key={filter.title} disablePadding sx={{ display: 'block' }}>
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
    </Drawer>
  )
}

export default SideNav2
