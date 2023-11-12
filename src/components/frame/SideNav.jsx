/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'

const SideNav1 = ({ links, variant }) => {
  const getWidth = () => {
    switch (variant) {
      case 'collapsed':
        return 'var(--side-nav-width-collapsed)'
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
        transition: 'width 0.5s ease-in-out',
      }}
    >
      <List>
        {links.map((link, index) => {
          return (
            <SideNavIcon
              key={index}
              link={link}
              isCollapsed={variant == 'collapsed'}
              isHidden={variant == 'hidden'}
            />
          )
        })}
      </List>
    </Box>
  )
}

export default SideNav1