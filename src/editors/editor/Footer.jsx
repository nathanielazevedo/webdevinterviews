import { Box, Tooltip, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      style={{
        height: '25px',
        display: 'flex',
        padding: '0 10px',
        alignItems: 'center',
        backgroundColor: '#121212',
        justifyContent: 'space-between',
        borderTop: '0.5px solid var(--color-solid-resize-bar)',
      }}
    >
      <Tooltip
        title='AutoSave is on. Check localstorage to view your save.'
        sx={{
          gap: '10px',
          display: 'flex',
          paddingLeft: '10px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='caption' style={{ color: 'var(--color-text)' }}>
          AutoSave:
          <Typography variant='caption' color={'primary'}>
            ON
          </Typography>
        </Typography>
      </Tooltip>
      <Typography
        noWrap
        fontSize={10}
        sx={{ color: '#C5C5C5', paddingBottom: '3px' }}
      >
        WEB DEV INTERVIEWS
      </Typography>
    </Box>
  )
}

export default Footer
