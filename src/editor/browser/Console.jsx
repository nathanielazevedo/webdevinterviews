import { Console as ConsoleFeed } from 'console-feed'
import { useEffect } from 'react'
import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Typography, Box, Tooltip, Button, IconButton } from '@mui/material'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

const Console = ({ closeFilePanel, consolePanelRef }) => {
  const { logs, reset } = useSandpackConsole({})
  const { listen } = useSandpack()

  useEffect(() => {
    const stopListening = listen((msg) => {
      if (msg.type === 'status' && msg.status === 'transpiling') {
        logs.splice(0, logs.length)
        logs.push({
          method: 'log',
          data: ['Auto Saved'],
        })
      }
    })

    return () => {
      stopListening()
    }
  }, [listen])

  return (
    <div
      style={{
        height: '100%',
        backgroundColor: '#121212',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          color: '#C5C5C5',
          flexDirection: 'column',
          backgroundColor: '#121212',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '0.5px solid var(--color-solid-resize-bar)',
            height: '35px',
            minHeight: '35px',
            marginTop: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              onClick={closeFilePanel}
              sx={{ height: '20px', color: '#C5C5C5', minWidth: '30px' }}
            >
              <Tooltip title='Collapse'>
                {consolePanelRef.current ? (
                  consolePanelRef.current.getSize() >= 3.3 ? (
                    <ExpandMoreIcon fontSize='small' />
                  ) : (
                    <ExpandLessIcon fontSize='small' />
                  )
                ) : (
                  <ExpandMoreIcon fontSize='small' />
                )}
              </Tooltip>
            </Button>
            <Typography fontSize='small'>
              Console {`(${logs.length})`}
            </Typography>
          </Box>
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
              LOG_BACKGROUND: '#121212',
              BASE_BACKGROUND_COLOR: '#121212',
              LOG_AMOUNT_BACKGROUND: 'black',
              BASE_FONT_SIZE: '14px',
              BASE_FONT_FAMILY: 'monospace',
              BASE_LINE_HEIGHT: '10px',
              TREENODE_LINE_HEIGHT: '20px',
            }}
          />
        </Box>
      </Box>
    </div>
  )
}

export default Console
