/* eslint-disable react/prop-types */
import { Console as ConsoleFeed } from 'console-feed'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Typography, Box, Tooltip, Button } from '@mui/material'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { useSandpackConsole } from '@codesandbox/sandpack-react'

const Console = ({ closeFilePanel, consolePanelRef }) => {
  const { logs, reset } = useSandpackConsole({})

  return (
    <div
      style={{
        height: '100%',
        backgroundColor: '#121212',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          color: '#C5C5C5',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5px 10px 5px 10px',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          borderBottom: '0.5px solid var(--color-solid-resize-bar)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
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
          <Typography fontSize={'small'}>
            Console {`(${logs.length})`}
          </Typography>
        </Box>
        <Button
          onClick={reset}
          sx={{ height: '20px', color: '#C5C5C5', minWidth: '30px' }}
        >
          <Tooltip title='Clear'>
            <DoNotDisturbAltIcon fontSize='small' />
          </Tooltip>
        </Button>
      </Box>
      <Box paddingTop={4.5} sx={{ overflowY: 'scroll', height: '100%' }}>
        <ConsoleFeed logs={logs} variant='dark' />
      </Box>
    </div>
  )
}

export default Console
