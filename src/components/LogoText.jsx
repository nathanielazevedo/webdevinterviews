import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const LogoText = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '30px',
        maxHeight: '30px',
      }}
    >
      <Typography component='div' color='grey.300' fontSize={'14px'}>
        WEB
      </Typography>
      <span
        style={{
          color: 'black',
          padding: '0 2px',
          margin: '0 5px',
          backgroundColor: '#19e4ff',
          fontWeight: 'bold',
          fontSize: '11px',
          maxHeight: '17px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        DEV
      </span>
      <Typography component='div' color='grey.300' fontSize={'14px'}>
        INTERVIEWS
      </Typography>
    </Box>
  )
}

export default LogoText
