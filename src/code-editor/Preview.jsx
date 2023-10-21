import { useRef } from 'react'
import { Console } from 'console-feed'
import ResizeHandle from '../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { Typography, Box, Tooltip, Button } from '@mui/material'
import { useSandpackConsole } from '@codesandbox/sandpack-react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

const Preview = () => {
  const previewRef = useRef()
  const { logs, reset } = useSandpackConsole({})

  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel minSize={0}>
          <SandpackPreview
            showNavigator
            ref={previewRef}
            style={{ height: '100%' }}
            showOpenInCodeSandbox={false}
          />
        </Panel>
        <ResizeHandle direction='vertical' className='horz' />
        <Panel minSize={0} collapsible={true}>
          <div
            style={{
              height: '100%',
              overflow: 'scroll',
              paddingBottom: '5rem',
              backgroundColor: '#242424',
            }}
          >
            <Box
              sx={{
                color: '#C5C5C5',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px 10px 5px 10px',
                borderBottom: '0.5px solid var(--color-solid-resize-bar)',
              }}
            >
              <Typography fontSize={'small'}>
                Console {`(${logs.length})`}
              </Typography>
              <Button
                onClick={reset}
                sx={{ height: '20px', color: '#C5C5C5', minWidth: '30px' }}
              >
                <Tooltip title='Clear'>
                  <DoNotDisturbAltIcon fontSize='small' />
                </Tooltip>
              </Button>
            </Box>
            <Console logs={logs} variant='dark' />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Preview
