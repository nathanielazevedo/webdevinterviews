/* eslint-disable react/prop-types */
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

const SideNavIcon = ({ link, isActive }) => {
  const color = isActive ? 'primary.main' : 'grey.600'
  return (
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
            color: color,
            justifyContent: 'center',
          }}
        >
          {link.icon}
        </ListItemIcon>
        <Typography sx={{ fontSize: '9px', color: color }}>
          {link.name}
        </Typography>
      </ListItemButton>
    </ListItem>
  )
}

export default SideNavIcon
