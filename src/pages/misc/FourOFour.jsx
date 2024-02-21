import { Typography } from '@mui/material'

const FourOFour = () => {
  return (
    <div className='fit-wrapper'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Typography variant='h1' sx={{ color: 'grey.500' }}>
          404
        </Typography>
        <Typography variant='h4'>Page Not Found</Typography>
      </div>
    </div>
  )
}

export default FourOFour
