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
import EditorSideNav from './EditorSideNav'
import {
  SandpackLayout,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import { Box } from '@mui/material'

const EditorMain = ({ files }) => {
  const codemirrorInstance = useRef()
  const [workoutState] = useContext(WorkoutContext)
  const filePanelRef = useRef()

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
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <EditorSideNav filePanelRef={filePanelRef} />
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
                ref={filePanelRef}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <SandpackFileExplorer />
                </Box>
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
