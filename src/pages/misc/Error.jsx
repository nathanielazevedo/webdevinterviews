import { Box, Typography } from '@mui/material'
import { useRouteError, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PropTypes from 'prop-types'

const Error = ({ redirectPath }) => {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath)
    }
  }, [redirectPath, navigate])

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

Error.propTypes = {
  redirectPath: PropTypes.string,
}

Error.defaultProps = {
  redirectPath: '/workouts/official',
}
