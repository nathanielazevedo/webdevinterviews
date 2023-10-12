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

const EditorMain = ({ demo, files, setFiles, challenge }) => {
  const codemirrorInstance = useRef()

  return (
    <>
      <SandpackProvider
        template='react'
        files={files}
        options={{ visibleFiles: ['/App.js'] }}
      >
        {!demo && <LocalStorage challenge={challenge} setCode={setFiles} />}
        <SandpackThemeProvider
          theme={{
            colors: {
              surface1: '#151515',
              surface2: '#252525',
              surface3: '#2F2F2F',
              clickable: '#999999',
              base: '#808080',
              disabled: '#4D4D4D',
              hover: '#C5C5C5',
              accent: '#4ef8fe',
              error: '#E1CFF8',
              errorSurface: '#b08df8',
            },
            syntax: {
              plain: '#f0fdaf',
              comment: {
                color: '#757575',
                fontStyle: 'italic',
              },
              keyword: '#55dfe4',
              tag: '#71e251',
              punctuation: '#ffffff',
              definition: '#f18636',
              property: '#90e86f',
              static: '#ffffff',
              string: '#dafecf',
            },
            font: {
              body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              mono: '"Bai Jamjuree", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
              size: '13px',
              lineHeight: '20px',
            },
          }}
        >
          <SandpackLayout>
            <div className='layout'>
              <PanelGroup
                autoSaveId='editor-prefs'
                direction='horizontal'
                disablePointerEventsDuringResize
              >
                <>
                  <Panel
                    collapsible={true}
                    defaultSize={demo ? 10 : 20}
                    order={1}
                  >
                    <div style={{ height: '100%', overflow: 'auto' }}>
                      <SandpackFileExplorer
                        style={{ height: '100%', overflow: 'auto' }}
                      />
                    </div>
                  </Panel>
                  <ResizeHandle />
                </>
                <>
                  <Panel
                    order={2}
                    collapsible={true}
                    // style={{ overflow: 'scroll' }}
                  >
                    <SandpackCodeEditor
                      ref={codemirrorInstance}
                      wrapContent
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                      autoScroll
                      style={{ height: '100%' }}
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
