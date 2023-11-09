/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideNavIcon from './SideNavIcon'
import { useLocation } from 'react-router-dom'

const SideNav1 = ({ links }) => {
  const location = useLocation()
  const firstPath = location.pathname.split('/')[1]

  return (
    <Box sx={{ width: '65px', borderRight: '0.5px solid #454950' }}>
      <List>
        {links.map((link, index) => {
          const isActive = '/' + firstPath === link.path
          return <SideNavIcon key={index} link={link} isActive={isActive} />
        })}
      </List>
    </Box>
  )
}

export default SideNav1
