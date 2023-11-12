/* eslint-disable react/prop-types */
import { useRef } from 'react'
import Console from './Console'
import ResizeHandle from '../../ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackPreview, SandpackTests } from '@codesandbox/sandpack-react'

const Browser = ({ showTests }) => {
  const consolePanelRef = useRef()

  const closeFilePanel = () => {
    if (consolePanelRef.current) {
      if (consolePanelRef.current.getSize() === 3.3) {
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
          {showTests ? (
            <SandpackTests style={{ height: '100%' }} />
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
