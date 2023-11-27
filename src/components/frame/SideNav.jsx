/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'

const SideNav = ({ links, variant }) => {
  const getWidth = () => {
    switch (variant) {
      case 'collapsed':
        return '0px'
      case 'hidden':
        return '0'
      default:
        return 'var(--side-nav-width)'
    }
  }

  return (
    <Box
      sx={{
        width: getWidth(),
        borderRight: '0.5px solid var(--divider)',
        transition: 'width 0.3s ease-in-out',
        height: '100%',
      }}
    >
      <List>
        {links.map((link, index) => {
          return (
            <SideNavIcon
              key={index}
              link={link}
              isHidden={variant == 'collapsed'}
            />
          )
        })}
      </List>
    </Box>
  )
}

export default SideNav
