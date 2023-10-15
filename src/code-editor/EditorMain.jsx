/* eslint-disable react/prop-types */
import './styles.css'
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { theme } from './theme'
import AutoSave from './AutoSave'
import { useRef, useState } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../resizeable-panels/ResizeHandle'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'

const EditorMain = ({ demo, files, setFiles, challenge }) => {
  const codemirrorInstance = useRef()
  const [saved, setSaved] = useState(true)
  const storedAutoSave = localStorage.getItem('autoSave')
  const [manuallySaved, setManuallySaved] = useState(false)
  const [autoSave, setAutoSave] = useState(storedAutoSave === 'true')

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        className='component'
        style={{
          width: '97vw',
          height: '97vh',
          border: 'solid var(--color-solid-resize-bar) 0.5px',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <SandpackProvider
          files={files}
          template='react'
          options={{
            autoReload: false,
            visibleFiles: ['/App.js'],
          }}
        >
          <AutoSave
            demo={demo}
            setCode={setFiles}
            setSaved={setSaved}
            autoSave={autoSave}
            challenge={challenge}
            manuallySaved={manuallySaved}
            setManuallySaved={setManuallySaved}
          />
          <SandpackThemeProvider theme={theme}>
            <Toolbar
              demo={demo}
              setCode={setFiles}
              saved={saved}
              setSaved={setSaved}
              autoSave={autoSave}
              challenge={challenge}
              setManuallySaved={setManuallySaved}
              setAutoSave={setAutoSave}
              codemirrorInstance={codemirrorInstance}
            />
            <SandpackLayout>
              <div
                style={{
                  display: 'flex',
                  width: ' 100%',
                  minHeight: 'calc(97vh - 55px)',
                  maxHeight: 'calc(97vh - 55px)',
                }}
              >
                <PanelGroup
                  direction='horizontal'
                  autoSaveId='editor-prefs'
                  disablePointerEventsDuringResize
                >
                  <Panel minSize={0} defaultSize={45} collapsible={true}>
                    <Preview
                      demo={demo}
                      setCode={setFiles}
                      challenge={challenge}
                      codemirrorInstance={codemirrorInstance}
                    />
                  </Panel>
                  <ResizeHandle className='left' />
                  <Panel minSize={0} defaultSize={40} collapsible={true}>
                    <SandpackCodeEditor
                      showTabs
                      closableTabs
                      showLineNumbers
                      showInlineErrors
                      ref={codemirrorInstance}
                      style={{ height: '100%' }}
                    />
                  </Panel>
                  <ResizeHandle className='right' />
                  <Panel
                    className='file-bg'
                    minSize={0}
                    defaultSize={15}
                    collapsible={true}
                  >
                    <SandpackFileExplorer
                      className='nate'
                      style={{
                        backgroundColor: 'transparent',
                      }}
                    />
                  </Panel>
                </PanelGroup>
              </div>
            </SandpackLayout>
          </SandpackThemeProvider>
          <Footer />
        </SandpackProvider>
      </div>
    </div>
  )
}

export default EditorMain
