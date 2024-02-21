import { useEffect } from 'react'
import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { Console as ConsoleFeed } from 'console-feed'
import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

const Console = () => {
  const { logs, reset } = useSandpackConsole({})
  const { listen } = useSandpack()

  useEffect(() => {
    const stopListening = listen((msg) => {
      if (msg.type === 'status' && msg.status === 'transpiling') {
        logs.splice(0, logs.length)
      }
    })
    return () => {
      stopListening()
    }
  }, [listen])

  return (
    <div style={{ height: '100%', backgroundColor: '#151515' }}>
      <Box
        sx={{
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '0.5px solid var(--color-solid-resize-bar)',
          height: '35px',
        }}
      >
        <Typography fontSize='small'>Console {`(${logs.length})`}</Typography>
        <IconButton onClick={reset}>
          <Tooltip title='Clear'>
            <DoNotDisturbAltIcon fontSize='small' />
          </Tooltip>
        </IconButton>
      </Box>
      <Box sx={{ overflowY: 'scroll', height: '100%' }}>
        <ConsoleFeed
          logs={logs}
          variant='dark'
          styles={{
            LOG_BACKGROUND: '#151515',
            BASE_BACKGROUND_COLOR: '#151515',
            LOG_AMOUNT_BACKGROUND: 'black',
            // BASE_FONT_SIZE: '14px',
            BASE_FONT_FAMILY: 'monospace',
            // BASE_LINE_HEIGHT: '10px',
            TREENODE_LINE_HEIGHT: '20px',
          }}
        />
      </Box>
    </div>
  )
}

export default Console
