import Box from '@mui/material/Box'
import { useContext, useState } from 'react'
import { Button, Tooltip, Typography, CircularProgress } from '@mui/material'
import { LogContext } from '../../pages/LogContext'
import LogDialog from '../../pages/LogDialog'

const Footer = () => {
  const { logs } = useContext(LogContext)
  const latestLog = logs[logs.length - 1]
  const [logDialogOpen, setLogDialogOpen] = useState(false)

  const getButtonText = () => {
    if (latestLog) {
      if (latestLog.method === 'log') {
        return (
          <Button
            variant='text'
            color='success'
            onClick={() => {
              setLogDialogOpen(true)
            }}
            sx={{
              fontSize: '14px',
            }}
          >
            <Typography sx={{ fontSize: '10px' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      }
      if (latestLog.method === 'info') {
        return (
          <Button
            variant='text'
            onClick={() => {
              setLogDialogOpen(true)
            }}
            sx={{
              fontSize: '14px',
            }}
          >
            <CircularProgress
              size={12}
              sx={{ marginRight: '10px', color: 'primary.main' }}
            />
            <Typography sx={{ fontSize: '10px' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      }
      if (latestLog.method === 'error') {
        return (
          <Button
            variant='text'
            color='error'
            onClick={() => {
              setLogDialogOpen(true)
            }}
            sx={{
              fontSize: '14px',
              color: 'primary',
            }}
          >
            <Typography sx={{ fontSize: '10px' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      }
      return null
    }
  }

  return (
    <Box
      sx={{
        height: '35px',
        borderTop: '0.5px solid #454950',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        padding: '0px 20px',
      }}
    >
      <Tooltip title='View Logs' placement='left'>
        <>{getButtonText()}</>
      </Tooltip>
      <LogDialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} />
    </Box>
  )
}

export default Footer
