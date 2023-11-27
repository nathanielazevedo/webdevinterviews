import { Box, Typography } from '@mui/material'
import { useRouteError, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import RateLimitPage from './RateLimitError' // Import the RateLimitPage component

const Error = ({ redirectPath }) => {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath)
    }
  }, [redirectPath, navigate])

  if (error.status === 429) {
    return <RateLimitPage />
  }

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
        <Typography variant='h4' color={'red'}>
          Error
        </Typography>
        <Typography variant='h5'>
          Error Message:{' '}
          <span
            style={{
              color: 'red',
            }}
          >
            {error.statusText || error.message}
          </span>
        </Typography>
        <Typography variant='h5'>Does this keep happening?</Typography>
        <Typography variant='h5'>Some options:</Typography>
        <Typography variant='h5'>message me on LinkedIn</Typography>
        <Typography variant='h5'>clear local storage</Typography>
      </Box>
    </Box>
  )
}

export default Error

Error.propTypes = {
  redirectPath: PropTypes.string,
}
