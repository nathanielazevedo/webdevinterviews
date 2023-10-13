/* eslint-disable react/prop-types */
import PreviewTabs from './PreviewTabs'
import { SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { Typography } from '@mui/material'

const Preview = ({ setCode, codemirrorInstance, challenge, demo }) => {
  return (
    <PanelGroup
      autoSaveId='console'
      disablePointerEventsDuringResize
      direction='vertical'
    >
      <Panel>
        <PreviewTabs
          demo={demo}
          setCode={setCode}
          challenge={challenge}
          codemirrorInstance={codemirrorInstance}
        />
        <SandpackPreview style={{ height: '95%' }} />
      </Panel>
      <ResizeHandle direction='vertical' />
      <Panel collapsible>
        <Typography
          variant='h6'
          sx={{ textAlign: 'left', marginLeft: '10px', color: '#dcdcaa' }}
        >
          Console
        </Typography>
        <SandpackConsole style={{ height: '90%' }} />
      </Panel>
    </PanelGroup>
  )
}

export default Preview
