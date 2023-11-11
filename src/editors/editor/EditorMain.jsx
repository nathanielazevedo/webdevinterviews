/* eslint-disable react/prop-types */
import Preview from './Preview'
import { theme } from './theme'
import AutoSave from './AutoSave'
import SpeedDial from './SpeedDial'
import { useRef, useContext } from 'react'
import { WorkoutContext } from '../../App'
import { useLoaderData } from 'react-router-dom'
import ResizeHandle from '../../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
} from '@codesandbox/sandpack-react'

const EditorMain = () => {
  const filePanelRef = useRef()
  const codemirrorInstance = useRef()
  const [workoutState] = useContext(WorkoutContext)
  const { files, mode, workout } = useLoaderData()

  return (
    <>
      <SandpackProvider
        files={files}
        template='react'
        customSetup={{ dependencies: { 'jest-extended': '^3.0.2' } }}
        options={{
          autoReload: true,
          activeFile: workoutState.activeFile,
          visibleFiles: workoutState.visibleFiles,
        }}
      >
        {mode === 'template' && <AutoSave workout={workout} />}
        <SandpackThemeProvider theme={theme}>
          <SandpackLayout>
            <div
              style={{
                width: '100%',
                minHeight: 'calc(100vh - 62px)',
                maxHeight: 'calc(100vh - 62px)',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
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
                  ref={filePanelRef}
                >
                  <SandpackFileExplorer />
                </Panel>
                <ResizeHandle />
                <Panel
                  minSize={0}
                  defaultSize={40}
                  collapsible={true}
                  style={{ position: 'relative' }}
                >
                  <SandpackCodeEditor
                    showTabs
                    closableTabs
                    showLineNumbers
                    showInlineErrors
                    showRunButton={true}
                    ref={codemirrorInstance}
                    style={{ height: '100%' }}
                  />
                  {mode === 'template' && (
                    <SpeedDial
                      codemirrorInstance={codemirrorInstance}
                      workout={workout}
                    />
                  )}
                </Panel>
                <ResizeHandle />
                <Panel minSize={0} defaultSize={45} collapsible={true}>
                  <Preview />
                </Panel>
              </PanelGroup>
            </div>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  )
}

export default EditorMain
