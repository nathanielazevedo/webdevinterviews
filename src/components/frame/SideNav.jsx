/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'

const SideNav = ({ links, lastLink }) => {
  return (
    <Box
      sx={{
        width: 'var(--side-nav-width)',
        borderRight: '0.5px solid var(--divider)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <List
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {links.map((link, index) => {
          return <SideNavIcon key={index} link={link} />
        })}
      </List>

      {lastLink && <SideNavIcon link={lastLink} />}
    </Box>
  )
}

export default SideNav
