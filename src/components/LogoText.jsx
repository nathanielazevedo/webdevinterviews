import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const LogoText = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0px',
        fontSize: '14px',
      }}
    >
      <Typography variant='' noWrap component='div' color='grey.200'>
        WEB
      </Typography>
      <span
        style={{
          color: 'black',
          border: 'solid #19e4ff 1px',
          borderRadius: '5px',
          padding: '0 3px',
          margin: '0 5px',
          backgroundColor: '#19e4ff',
          fontWeight: 'bold',
          fontSize: '12px',
          maxHeight: '17px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        DEV
      </span>
      <Typography
        variant=''
        noWrap
        component='div'
        color='grey.200'
        fontSize={'14px'}
      >
        INTERVIEWS
      </Typography>
    </Box>
  )
}

export default LogoText
