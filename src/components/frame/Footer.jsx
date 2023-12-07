import Box from '@mui/material/Box'
import { useContext } from 'react'
import { LogContext } from '../../pages/LogContext'
import { Button, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { CircularProgress } from '@mui/material'
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
            variant='contained'
            color='success'
            onClick={() => {
              setLogDialogOpen(true)
            }}
            sx={{
              fontSize: '14px',
            }}
          >
            <Typography sx={{ fontSize: '10px', color: 'black' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      } else if (latestLog.method === 'info') {
        return (
          <Button
            variant='contained'
            onClick={() => {
              setLogDialogOpen(true)
            }}
            sx={{
              fontSize: '14px',
            }}
          >
            <CircularProgress
              size={12}
              sx={{ marginRight: '10px', color: 'black' }}
            />
            <Typography sx={{ fontSize: '10px', color: 'black' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      } else if (latestLog.method === 'error') {
        return (
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
            <Typography
              sx={{
                fontSize: '10px',
                color: 'black',
                border: '1px solid black',
                marginRight: '10px',
                padding: '0px 5px',
              }}
            >
              {latestLog.code}
            </Typography>

            <Typography sx={{ fontSize: '10px', color: 'black' }}>
              {latestLog.data[0]}
            </Typography>
          </Button>
        )
      }
    }
  }

  return (
    <Box
      sx={{
        height: '35px',
        borderTop: '0.5px solid #454950',
        // outline: '1px solid green',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Tooltip title='View Logs' placement='left'>
        {getButtonText()}
      </Tooltip>
      <LogDialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} />
    </Box>
  )
}

export default Footer
