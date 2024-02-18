import { useRef, useContext } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { Box, Typography } from '@mui/material'
import ResizeHandle from '../../../components/ResizeHandle'
import Browser from './browser/Root'
import AutoSave from './AutoSave'
import { theme } from './theme'
import { WorkoutContext } from '../../../contexts/WorkoutContext'
import HorizontalResizeHandle from '../../../components/HorizontalResizeHandle'
import Prettier from './components/Prettier'
import { layoutStyles, sourceControlHeaderStyles } from './editorStyles'
import ChangedFiles from './components/ChangedFiles'
import { CircularProgress } from '@mui/material'

const mergeFiles = (workout, isSolution) => {
  const local = isSolution ? workout.files.solution : workout.files.template
  const shared = workout.files.shared
  const packageJson = workout.files.packageJson
  return { ...local, ...shared, ...packageJson }
}

const EditorMain = ({ isSolution }) => {
  const codemirrorInstance = useRef()
  const { workout } = useContext(WorkoutContext)

  const renderAutoSave = () => {
    if (workout?.isOwner) {
      return true
    }
    if (!isSolution) {
      return true
    }
    return false
  }

  return (
    <SandpackProvider
      files={mergeFiles(workout, isSolution)}
      template={workout.type === 'vanilla' ? 'static' : workout.type}
      options={{
        autoReload: true,
        visibleFiles: ['/App.js'],
        activeFile: '/App.js',
      }}
    >
      {renderAutoSave() && (
        <AutoSave
          workout={workout}
          isSolution={isSolution}
          cmInstance={codemirrorInstance.current}
        />
      )}

      <SandpackThemeProvider theme={theme}>
        <SandpackLayout>
          <div style={layoutStyles}>
            <PanelGroup
              direction='horizontal'
              autoSaveId='editor-prefs'
              disablePointerEventsDuringResize
            >
              <Panel minSize={0} defaultSize={15} collapsible>
                <PanelGroup
                  direction='vertical'
                  autoSaveId='editor-prefs-file-explorer'
                  disablePointerEventsDuringResize
                >
                  <Panel>
                    <SandpackFileExplorer />
                  </Panel>
                  {workout.isOwner && (
                    <>
                      <HorizontalResizeHandle />
                      <Panel>
                        <Box sx={sourceControlHeaderStyles}>
                          <Typography sx={{ fontSize: '12px' }}>
                            SOURCE CONTROL
                          </Typography>
                        </Box>
                        <ChangedFiles isSolution={isSolution} />
                      </Panel>
                    </>
                  )}
                </PanelGroup>
              </Panel>
              <ResizeHandle />
              <Panel
                minSize={0}
                defaultSize={40}
                collapsible
                style={{ position: 'relative' }}
              >
                <SandpackCodeEditor
                  showTabs
                  closableTabs
                  showLineNumbers
                  showInlineErrors={false}
                  wrapContent
                  showRunButton
                  ref={codemirrorInstance}
                  style={{ height: '100%' }}
                />
                <Prettier codemirrorInstance={codemirrorInstance} />
              </Panel>
              <ResizeHandle />
              <Panel
                minSize={0}
                defaultSize={45}
                collapsible
                style={{
                  position: 'relative',
                }}
              >
                <Browser />
              </Panel>
            </PanelGroup>
          </div>
        </SandpackLayout>
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default EditorMain
