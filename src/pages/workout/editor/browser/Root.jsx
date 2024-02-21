import { useRef } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import PreviewTabs from './Preview'
import Console from './Console'
import ResizeHandle from '../../../../components/ResizeHandle'

const Browser = () => {
  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel>
          <PreviewTabs />
        </Panel>
        <ResizeHandle horz={true} />
        <Panel>
          <Console />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Browser
