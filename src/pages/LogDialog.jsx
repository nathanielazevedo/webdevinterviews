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
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#121212',
          color: '#C5C5C5',
          width: '80%',
          height: '80%',
          borderRadius: '10px',
          border: '1px solid #454950',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
          padding: '0px',
          margin: '0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        },
      }}
    >
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
      <DialogContent
        sx={{
          backgroundColor: '#121212',
          width: '100%',
          height: '100%',
          padding: '0px',
          margin: '0px',
          paddingTop: '10px !important',
        }}
      >
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
