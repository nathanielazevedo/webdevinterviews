/* eslint-disable react/prop-types */
import { SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { Typography } from '@mui/material'
import Console from './Console'

const Preview = () => {
  return (
    <div
      style={{
        height: '96%',
        display: 'flex',
        flexDirection: 'column',
        // border: '1px solid #2F2F2F',
        // borderTop: 'none',
      }}
    >
      <PanelGroup
        autoSaveId='console'
        disablePointerEventsDuringResize
        direction='vertical'
      >
        <Panel minSize={0}>
          <SandpackPreview style={{ height: '100%' }} showNavigator />
        </Panel>
        <ResizeHandle direction='vertical' />
        <Panel
          collapsible={true}
          minSize={0}
          style={{
            backgroundColor: 'black',
            borderTop: '1px solid #2F2F2F',
          }}
        >
          <Typography
            variant='h6'
            p={1}
            sx={{
              textAlign: 'left',
              marginLeft: '10px',
              color: '#dcdcaa',
              height: '40px',
            }}
          >
            Console
          </Typography>
          <SandpackConsole
            clientId='console'
            style={{
              height: '100%',
              backgroundColor: 'black',
              overflow: 'auto',
            }}
          >
            <div>hllo</div>
          </SandpackConsole>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Preview
