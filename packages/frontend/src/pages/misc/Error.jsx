import { Box, Button, Typography } from '@mui/material'
import { useRouteError } from 'react-router-dom'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TextLink from '../../components/TextLink'

const Error = () => {
  const error = useRouteError()

  return (
    <div style={{ paddingTop: '50px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: '50px',
        }}
      >
        <SmartToyIcon sx={{ color: 'red', fontSize: '100px' }} />
        <Typography variant='h5'>You broke me.</Typography>
        <Typography color='error'>Tell me how you did this.</Typography>
        <TextLink text={'Contact'} to='/contact' />
      </Box>
    </div>
  )
}

export default Error
