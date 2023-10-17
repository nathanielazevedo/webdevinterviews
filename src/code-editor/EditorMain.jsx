/* eslint-disable react/prop-types */
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { theme } from './theme'
import AutoSave from './AutoSave'
import { useRef, useState, useContext } from 'react'
import ResizeHandle from '../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import { RenderCounter } from '../components/RenderCount'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import { WorkoutContext } from '../workouts/Workout'

const EditorMain = () => {
  const codemirrorInstance = useRef()
  const storedAutoSave = localStorage.getItem('autoSave')
  const [manuallySaved, setManuallySaved] = useState(false)
  const [workoutState] = useContext(WorkoutContext)
  const [autoSave, setAutoSave] = useState(storedAutoSave === 'true')

  return (
    <SandpackProvider
      files={workoutState.files}
      template='react'
      options={{
        autoReload: false,
        visibleFiles: ['/App.js'],
      }}
    >
      <RenderCounter name={'EditorMain'} />
      {/* {autoSave && (
        <AutoSave
          autoSave={autoSave}
          manuallySaved={manuallySaved}
          setManuallySaved={setManuallySaved}
        />
      )} */}
      <SandpackThemeProvider theme={theme}>
        <Toolbar
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          setManuallySaved={setManuallySaved}
          codemirrorInstance={codemirrorInstance}
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
