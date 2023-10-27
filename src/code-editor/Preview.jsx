import { Console } from 'console-feed'
import ResizeHandle from '../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackPreview, SandpackTests } from '@codesandbox/sandpack-react'
import { Typography, Box, Tooltip, Button } from '@mui/material'
import { useSandpackConsole } from '@codesandbox/sandpack-react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { WorkoutContext } from '../workouts/Workout'
import { useContext, useRef } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const Preview = () => {
  const { logs, reset } = useSandpackConsole({})
  const [workoutState] = useContext(WorkoutContext)
  const consolePanelRef = useRef()

  const closeFilePanel = () => {
    if (consolePanelRef.current) {
      if (consolePanelRef.current.getSize() === 3.3) {
        console.log(consolePanelRef.current.getSize())
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
          {workoutState.showTests ? (
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
              // paddingBottom: '5rem',
              backgroundColor: '#242424',
              position: 'relative',
              // display: 'flex',
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
                // border: 'solid white 1px',
                backgroundColor: '#242424',
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

export default Preview
