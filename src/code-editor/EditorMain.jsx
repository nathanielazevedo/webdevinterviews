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

  const colors = {
    lightBlue: '#9cdcfe',
    yellow: '#dcdcaa',
    purple: '#d16dce',
    green: '#6a9956',
    orange: '#ce9178',
    comment: '#6a9956',
    blue: '#4fc1ff',
  }

  return (
    <div className='shadow'>
      <SandpackProvider
        template='react'
        files={files}
        options={{ visibleFiles: ['/App.js'] }}
      >
        {!demo && <LocalStorage challenge={challenge} setCode={setFiles} />}
        <SandpackThemeProvider
          theme={{
            colors: {
              surface1: '#1f1f1f',
              surface2: '#181818',
              surface3: '#2F2F2F',
              clickable: '#999999',
              base: '#808080',
              disabled: '#4D4D4D',
              hover: '#C5C5C5',
              accent: colors.yellow,
              error: 'white',
              errorSurface: '#5c0600',
            },
            syntax: {
              plain: colors.yellow,
              comment: {
                color: colors.green,
                fontStyle: 'italic',
              },
              keyword: colors.purple,
              tag: colors.blue,
              punctuation: colors.purple,
              definition: colors.yellow,
              property: colors.lightBlue,
              static: colors.blue,
              string: colors.orange,
            },
            font: {
              body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              mono: ' "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
              size: '15px',
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
                  <Panel order={2} collapsible={true}>
                    <SandpackCodeEditor
                      ref={codemirrorInstance}
                      wrapContent
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                      showRunButton
                      style={{ height: '100%' }}
                    />
                  </Panel>
                </>
                <>
                  <ResizeHandle />
                  <Panel collapsible={true} defaultSize={50} order={3}>
                    <Preview
                      demo={demo}
                      setCode={setFiles}
                      challenge={challenge}
                      codemirrorInstance={codemirrorInstance}
                    />
                  </Panel>
                </>
              </PanelGroup>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  )
}

export default EditorMain
