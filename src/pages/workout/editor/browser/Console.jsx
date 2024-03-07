import { useEffect, useContext } from 'react'
import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { Console as ConsoleFeed } from 'console-feed'
import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { ColorModeContext } from '../../../../contexts/ThemeContext'

const Console = () => {
  const { logs, reset } = useSandpackConsole({})
  const { listen } = useSandpack()
  const colorMode = useContext(ColorModeContext)

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
    <div style={{ height: '100%' }}>
      <Box
        sx={{
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '0.5px solid var(--divider)',
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
        <ConsoleFeed logs={logs} variant={colorMode.mode} />
      </Box>
    </div>
  )
}

export default Console
