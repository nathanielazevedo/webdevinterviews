/* eslint-disable react/prop-types */
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { theme } from './theme'
import AutoSave from './AutoSave'
import { useContext, useRef } from 'react'
import { WorkoutContext } from '../workouts/Workout'
import ResizeHandle from '../components/ResizeHandle'
import { RenderCounter } from '../components/RenderCount'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'

const EditorMain = () => {
  const [workoutState] = useContext(WorkoutContext)
  const codemirrorInstance = useRef()

  return (
    <SandpackProvider
      files={workoutState.files}
      template='react'
      options={{
        autoReload: true,
        visibleFiles: ['/App.js'],
      }}
    >
      <AutoSave />
      <RenderCounter name={'EditorMain'} />
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
