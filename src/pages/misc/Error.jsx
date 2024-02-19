import { Box, Typography } from '@mui/material'
import { useRouteError } from 'react-router-dom'

const Error = () => {
  const error = useRouteError()

  return (
    <Box
      sx={{
        padding: '50px',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '50px',
        }}
      >
        <Typography variant='h4' color='red'>
          Error
        </Typography>
        <Typography variant='h5'>
          <span
            style={{
              color: 'red',
            }}
          >
            {error.statusText || error.message}
          </span>
        </Typography>
      </Box>
    </Box>
  )
}

export default Error
