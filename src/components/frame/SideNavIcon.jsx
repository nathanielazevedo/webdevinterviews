import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import { NavLink } from 'react-router-dom'

const StyledListItemButton = styled(ListItemButton)(() => ({
  px: 2.5,
  height: 48,
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'height 0.5s ease-in-out',
}))

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  minWidth: 0,
  justifyContent: 'center',
  color: 'inherit',
}))

const StyledTypography = styled(Typography)(() => ({
  fontSize: '8px',
  transition: 'opacity 0.5s ease-in-out',
}))

const SideNavIcon = ({ link }) => {
  const getClassName = (isActive, isPending) => {
    if (isActive) return 'active'
    if (isPending) return 'pending'
    return 'not-active'
  }

  return (
    <NavLink
      end={link.end}
      to={link.path}
      replace={link.replace}
      className={({ isActive, isPending }) => getClassName(isActive, isPending)}
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
        <StyledListItemButton onClick={link.onClick}>
          <StyledListItemIcon>{link.icon}</StyledListItemIcon>

          <StyledTypography>{link.name}</StyledTypography>
        </StyledListItemButton>
      </ListItem>
    </NavLink>
  )
}

SideNavIcon.propTypes = {
  link: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    end: PropTypes.bool,
    replace: PropTypes.bool,
  }).isRequired,
}

export default SideNavIcon
