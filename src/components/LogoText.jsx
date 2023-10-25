import Typography from '@mui/material/Typography'

const LogoText = () => {
  return (
    <Typography variant='subtitle' noWrap component='div'>
      FLOW &nbsp;
      <span
        style={
          {
            // color: '#19e4ff',
            // color: 'black',
            // border: 'solid #19e4ff 1px',
            // borderRadius: '10px',
            // padding: '0 5px',
            // margin: '0 5px',
            // backgroundColor: '#19e4ff',
          }
        }
      >
        STATE
      </span>
      &nbsp; CODE
    </Typography>
  )
}

export default LogoText
