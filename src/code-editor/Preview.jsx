/* eslint-disable react/prop-types */
import { SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { Typography } from '@mui/material'

const Preview = () => {
  return (
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
        collapsible
        style={{
          backgroundColor: 'black',
          borderTop: '1px solid #2F2F2F',
        }}
        minSize={0}
      >
        <Typography
          variant='h6'
          p={1}
          sx={{ textAlign: 'left', marginLeft: '10px', color: '#dcdcaa' }}
        >
          Console
        </Typography>
        <SandpackConsole
          style={{ height: '85%', backgroundColor: 'black', overflow: 'auto' }}
        />
      </Panel>
    </PanelGroup>
  )
}

export default Preview
