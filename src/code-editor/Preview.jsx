import Console from './Console'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { SandpackPreview } from '@codesandbox/sandpack-react'

const Preview = () => {
  return (
    <div
      style={{
        height: '93.5vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel minSize={0}>
          <SandpackPreview style={{ height: '100%' }} showNavigator />
        </Panel>
        <ResizeHandle direction='vertical' />
        <Panel
          minSize={0}
          collapsible={true}
          style={{
            border: 'solid red 1px',
            height: '10vh',
            maxHeight: '30vh',
          }}
        >
          <Console />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Preview
