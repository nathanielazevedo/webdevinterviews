/* eslint-disable react/prop-types */
import { useRef } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import PreviewTabs from './PreviewTabs'
import Console from './Console'
import ResizeHandle from '../components/HorizontalResizeHandle'

const Browser = () => {
  const consolePanelRef = useRef()

  const closeFilePanel = () => {
    if (consolePanelRef.current) {
      if (consolePanelRef.current.getSize() === 4.3) {
        consolePanelRef.current.resize(50)
        return
      }
      consolePanelRef.current.resize(4.3)
    }
  }

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
        <ResizeHandle />
        <Panel minSize={4.3} collapsible={false} ref={consolePanelRef}>
          <Console
            closeFilePanel={closeFilePanel}
            consolePanelRef={consolePanelRef}
          />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Browser
