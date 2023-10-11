/* eslint-disable react/prop-types */
import './styles.css'
import Preview from './Preview'
import { useState, useRef } from 'react'
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

const MySandpackComponent = ({ challenge }) => {
  const [files, setFiles] = useState(
    localStorage.getItem(challenge.id) ?? undefined
  )

  const codemirrorInstance = useRef()

  return (
    <>
      <SandpackProvider
        template='react'
        files={files ? JSON.parse(files) : {}}
        options={{ visibleFiles: ['/App.js'] }}
      >
        <LocalStorage challenge={challenge} setCode={setFiles} />
        <SandpackThemeProvider theme={'dark'}>
          <SandpackLayout>
            <div className='layout'>
              <PanelGroup
                autoSaveId='editor-preferences'
                direction='horizontal'
              >
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
                  <Panel collapsible={true} defaultSize={20} order={3}>
                    <div>
                      <div
                        style={{
                          minWidth: 190,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Preview
                          setCode={setFiles}
                          codemirrorInstance={codemirrorInstance}
                        />
                      </div>
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

export default MySandpackComponent
