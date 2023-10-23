import { Box, Tooltip, Typography } from '@mui/material'
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
        justifyContent: 'space-between',
      }}
    >
      <Tooltip
        title='AutoSave is on. Check localstorage to view your save.'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          paddingBottom: '4px',
          paddingLeft: '10px',
        }}
      >
        <Typography variant='caption' style={{ color: 'var(--color-text)' }}>
          AutoSave:{' '}
          <Typography variant='caption' color={'primary'}>
            ON
          </Typography>
        </Typography>
      </Tooltip>
      <SmallLogoText />
    </Box>
  )
}

export default Footer
