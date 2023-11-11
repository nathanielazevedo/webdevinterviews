/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'

const SideNav1 = ({ links }) => {
  return (
    <Box
      sx={{
        width: 'var(--side-bar-1-width)',
        borderRight: '0.5px solid var(--divider)',
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

export default SideNav1
