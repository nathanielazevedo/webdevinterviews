import { useRef } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import PreviewTabs from './Preview'
import Console from './Console'
import ResizeHandle from '../../../../components/ResizeHandle'
import { SandpackPreview } from '@codesandbox/sandpack-react'

const Browser = () => {
  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel>
          <SandpackPreview
            showNavigator
            style={{ height: '100%' }}
            showOpenInCodeSandbox={false}
          />
        </Panel>
        <ResizeHandle horz={true} />
        <Panel>
          <PreviewTabs />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Browser
