import Typography from '@mui/material/Typography'

const SmallLogoText = () => {
  return (
    <Typography
      noWrap
      sx={{ color: '#C5C5C5', paddingBottom: '3px' }}
      fontSize={7}
    >
      WEB
      <span
        style={{
          color: 'black ',
          borderRadius: '5px',
          padding: '0 1px',
          margin: '0 3px',
          backgroundColor: '#C5C5C5',
          fontSize: '7px',
        }}
      >
        DEV
      </span>
      INTERVIEWS
    </Typography>
  )
}

export default SmallLogoText
