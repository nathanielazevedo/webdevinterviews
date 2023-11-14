/* eslint-disable react/prop-types */
import Preview from './Preview'
import Console from './Console'
import { useRef } from 'react'
import ResizeHandle from '../../HorizontalResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'

const Browser = ({ showTests }) => {
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
          <Preview showTests={showTests} />
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
