/* eslint-disable react/prop-types */
import './styles.css'
import { useRef } from 'react'
import Preview from './Preview'
import LocalStorage from './LocalStorage'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  SandpackLayout,
} from '@codesandbox/sandpack-react'

const EditorMain = ({ files, setFiles, challenge }) => {
  const codemirrorInstance = useRef()

  return (
    <>
      <SandpackProvider
        template='react'
        files={files}
        options={{ visibleFiles: ['/App.js'] }}
      >
        <LocalStorage challenge={challenge} setCode={setFiles} />
        <SandpackThemeProvider theme={'dark'}>
          <SandpackLayout>
            <div className='layout'>
              <PanelGroup autoSaveId='editor-prefs' direction='horizontal'>
                <>
                  <Panel collapsible={true} defaultSize={20} order={1}>
                    <SandpackFileExplorer style={{ height: '100%' }} />
                  </Panel>
                  <ResizeHandle />
                </>
                <>
                  <Panel
                    collapsible={true}
                    order={2}
                    style={{ overflow: 'scroll' }}
                  >
                    <SandpackCodeEditor
                      ref={codemirrorInstance}
                      wrapContent
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                    />
                  </Panel>
                </>
                <>
                  <ResizeHandle />
                  <Panel collapsible={true} defaultSize={50} order={3}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Preview
                        setCode={setFiles}
                        codemirrorInstance={codemirrorInstance}
                      />
                    </div>
                  </Panel>
                </>
              </PanelGroup>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  )
}

export default EditorMain
