/* eslint-disable react/prop-types */
import Footer from './Footer'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { theme } from './theme'
import { useContext, useRef } from 'react'
import ResizeHandle from '../components/ResizeHandle'
import { RenderCounter } from '../components/RenderCount'
import { Panel, PanelGroup } from 'react-resizable-panels'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import { WorkoutContext } from '../workouts/Workout'
import ChangeSpy from './ChangeSpy'
import { SandpackFileExplorer } from 'sandpack-file-explorer'

const EditorMain = () => {
  const [workoutState] = useContext(WorkoutContext)
  const renderCountRef = useRef(0)

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
      <SandpackThemeProvider theme={theme}>
        <ChangeSpy renderCountRef={renderCountRef} />
        <Toolbar renderCountRef={renderCountRef} />
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
