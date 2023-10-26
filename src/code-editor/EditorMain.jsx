/* eslint-disable react/prop-types */
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { useRef, useContext } from 'react'
import { WorkoutContext } from '../workouts/Workout'
import { theme } from './theme'
import AutoSave from './AutoSave'
import ResizeHandle from '../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'

const EditorMain = ({ files }) => {
  const codemirrorInstance = useRef()
  const [workoutState] = useContext(WorkoutContext)

  return (
    <SandpackProvider
      files={files}
      template='react'
      customSetup={{ dependencies: { 'jest-extended': '^3.0.2' } }}
      options={{
        autoReload: true,
        visibleFiles: workoutState.visibleFiles,
        activeFile: workoutState.activeFile,
      }}
    >
      <AutoSave />
      <SandpackThemeProvider theme={theme}>
        <Toolbar codemirrorInstance={codemirrorInstance} />
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
                  showRunButton={true}
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
