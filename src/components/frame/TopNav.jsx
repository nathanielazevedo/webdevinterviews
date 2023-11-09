/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import LogoText from '../LogoText'

const TopNav = ({ actions }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '35px',
        padding: '0px 20px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: '0.5px solid #454950',
      }}
    >
      <LogoText />
      {actions && actions}
    </Box>
  )
}

export default TopNav
