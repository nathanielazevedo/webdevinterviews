import Box from '@mui/material/Box'
import { useContext } from 'react'
import { LogContext } from '../../pages/LogContext'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { ApiContext } from '../../pages/ApiContext'
import { CircularProgress } from '@mui/material'
import LogDialog from '../../pages/LogDialog'

const Footer = () => {
  const { logs } = useContext(LogContext)
  const { apiState } = useContext(ApiContext)
  const latestLog = logs[logs.length - 1]
  const [logDialogOpen, setLogDialogOpen] = useState(false)

  const getButtonText = () => {
    if (latestLog) {
      if (latestLog.method === 'log') {
        return (
          <>
            <Button
              variant='contained'
              onClick={() => {
                setLogDialogOpen(true)
              }}
              sx={{
                fontSize: '14px',
                color: 'primary',
              }}
            >
              <Typography sx={{ fontSize: '10px', color: 'black' }}>
                {latestLog.data[0]}
              </Typography>
            </Button>
          </>
        )
      } else if (latestLog.method === 'info') {
        return (
          <>
            <Button
              variant='contained'
              onClick={() => {
                setLogDialogOpen(true)
              }}
              sx={{
                fontSize: '14px',
                color: 'primary',
              }}
            >
              <CircularProgress
                size={12}
                sx={{ marginRight: '5px', color: 'black' }}
              />
              <Typography sx={{ fontSize: '10px', color: 'black' }}>
                {latestLog.data[0]}
              </Typography>
            </Button>
          </>
        )
      } else if (latestLog.method === 'error') {
        return (
          <>
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                setLogDialogOpen(true)
              }}
              sx={{
                fontSize: '14px',
                color: 'primary',
              }}
            >
              <Typography sx={{ fontSize: '10px', color: 'black' }}>
                {latestLog.data[0]}
              </Typography>
            </Button>
          </>
        )
      }
    }
  }

  return (
    <Box
      sx={{
        height: '25px',
        borderTop: '0.5px solid #454950',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          marginLeft: '10px',
        }}
      >
        <CircularProgress
          color='primary'
          size={15}
          sx={{
            display: apiState.running ? 'block' : 'none',
            marginRight: '5px',
          }}
        />
        <Typography
          sx={{
            fontSize: '12px',
            color: 'primary',
            display: apiState.running ? 'block' : 'none',
          }}
        >
          {apiState.call}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'primary',
          // padding: '0 10px',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        {getButtonText()}
      </Box>
      <LogDialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} />
    </Box>
  )
}

export default Footer
