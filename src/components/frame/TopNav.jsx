import Box from '@mui/material/Box'
import LogoText from '../LogoText'

const TopNav = () => {
  return (
    <Box
      sx={{
        borderBottom: '0.5px solid #454950',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        padding: '0px 20px',
        minHeight: '35px',
      }}
    >
      <Box>
        <LogoText />
      </Box>
    </Box>
  )
}

export default TopNav
