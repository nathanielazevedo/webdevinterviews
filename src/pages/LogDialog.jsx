/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Console } from 'console-feed'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import { LogContext } from './LogContext'

const LogDialog = ({ open, onClose }) => {
  const { logs } = useContext(LogContext)

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        Logs
        <IconButton
          edge='end'
          color='inherit'
          onClick={onClose}
          aria-label='close'
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#121212' }}>
        <Console
          logs={logs}
          variant='dark'
          styles={{ BASE_BACKGROUND_COLOR: '#121212' }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default LogDialog
