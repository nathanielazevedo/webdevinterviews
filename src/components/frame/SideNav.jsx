/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'

const SideNav = ({ links }) => {
  return (
    <Box
      sx={{
        width: 'var(--side-nav-width)',
        borderRight: '0.5px solid var(--divider)',
        height: '100%',
      }}
    >
      <List>
        {links.map((link, index) => {
          return <SideNavIcon key={index} link={link} />
        })}
      </List>
    </Box>
  )
}

export default SideNav
