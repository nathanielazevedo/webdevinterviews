/* eslint-disable react/prop-types */
import { Console } from 'console-feed'
import { useRef } from 'react'
import ResizeHandle from '../../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Typography, Box, Tooltip, Button } from '@mui/material'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import {
  SandpackPreview,
  SandpackTests,
  useSandpackConsole,
} from '@codesandbox/sandpack-react'

const Browser = ({ showTests }) => {
  const { logs, reset } = useSandpackConsole({})
  const consolePanelRef = useRef()

  const closeFilePanel = () => {
    if (consolePanelRef.current) {
      if (consolePanelRef.current.getSize() === 3.3) {
        consolePanelRef.current.resize(50)
        return
      }
      consolePanelRef.current.resize(3.3)
    }
  }

  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel minSize={0}>
          {showTests ? (
            <SandpackTests />
          ) : (
            <SandpackPreview
              showNavigator
              style={{ height: '100%' }}
              showOpenInCodeSandbox={false}
            />
          )}
        </Panel>
        <ResizeHandle />
        <Panel minSize={3.3} collapsible={false} ref={consolePanelRef}>
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
              <Console logs={logs} variant='dark' />
            </Box>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Browser
