import { Box } from '@mui/material'
import SmallLogoText from '../components/SmallLogoText'

const Footer = () => {
  return (
    <Box
      style={{
        height: '20px',
        backgroundColor: '#171717',
        borderTop: '0.5px solid var(--color-solid-resize-bar)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px',
        justifyContent: 'flex-start',
      }}
    >
      <SmallLogoText />
    </Box>
  )
}

export default Footer
