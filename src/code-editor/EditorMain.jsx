/* eslint-disable react/prop-types */
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { theme } from './theme'
import AutoSave from './AutoSave'
import { useRef, useState } from 'react'
import ResizeHandle from '../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'

const EditorMain = ({
  files,
  setDemo,
  setFiles,
  challenge,
  localStorageKey,
  setShowInstructions,
}) => {
  const codemirrorInstance = useRef()
  const [saved, setSaved] = useState(true)
  const storedAutoSave = localStorage.getItem('autoSave')
  const [manuallySaved, setManuallySaved] = useState(false)
  const [autoSave, setAutoSave] = useState(storedAutoSave === 'true')

  return (
    <SandpackProvider
      files={files}
      template='react'
      options={{
        autoReload: false,
        visibleFiles: ['/App.js'],
      }}
    >
      <AutoSave
        setSaved={setSaved}
        autoSave={autoSave}
        challenge={challenge}
        manuallySaved={manuallySaved}
        localStorageKey={localStorageKey}
        setManuallySaved={setManuallySaved}
      />
      <SandpackThemeProvider theme={theme}>
        <Toolbar
          saved={saved}
          setFiles={setFiles}
          setDemo={setDemo}
          setSaved={setSaved}
          autoSave={autoSave}
          challenge={challenge}
          setAutoSave={setAutoSave}
          setManuallySaved={setManuallySaved}
          codemirrorInstance={codemirrorInstance}
          setShowInstructions={setShowInstructions}
        />
        <SandpackLayout>
          <div
            style={{
              width: '100%',
              minHeight: 'calc(100vh - 60px)',
              maxHeight: 'calc(100vh - 60px)',
            }}
          >
            <PanelGroup
              direction='horizontal'
              autoSaveId='editor-prefs'
              disablePointerEventsDuringResize
            >
              <Panel
                minSize={0}
                defaultSize={15}
                collapsible={true}
                className='file-bg'
              >
                <SandpackFileExplorer />
              </Panel>
              <ResizeHandle />
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
              <ResizeHandle />
              <Panel minSize={0} defaultSize={45} collapsible={true}>
                <Preview />
              </Panel>
            </PanelGroup>
          </div>
        </SandpackLayout>
        <Footer />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default EditorMain
