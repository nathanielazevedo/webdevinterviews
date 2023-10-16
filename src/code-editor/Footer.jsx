import { Box } from '@mui/material'
import SmallLogoText from '../components/SmallLogoText'

const Footer = () => {
  return (
    <Box
      style={{
        height: '25px',
        backgroundColor: '#171717',
        borderTop: '0.5px solid var(--color-solid-resize-bar)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        justifyContent: 'flex-end',
      }}
    >
      <SmallLogoText />
    </Box>
  )
}

export default Footer
