import Console from './Console'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { useRef } from 'react'

const Preview = () => {
  const previewRef = useRef()

  return (
    <div
      style={{
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        // border: 'solid #2f2f2f 1px',
        borderRadius: '0px',
      }}
    >
      <PanelGroup
        autoSaveId='console'
        direction='vertical'
        disablePointerEventsDuringResize
      >
        <Panel minSize={0}>
          <SandpackPreview
            style={{ height: '100%' }}
            showNavigator
            ref={previewRef}
            showOpenInCodeSandbox={false}
          />
        </Panel>
        <ResizeHandle direction='vertical' className='horz' />
        <Panel minSize={0} collapsible={true}>
          <div
            style={{
              backgroundColor: '#242424',
              height: '100%',
              overflow: 'scroll',
              paddingBottom: '5rem',
            }}
          >
            <Console previewRef={previewRef} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Preview
