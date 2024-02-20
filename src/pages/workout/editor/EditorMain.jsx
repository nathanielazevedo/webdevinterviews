import { useRef, useContext } from 'react'
import { WorkoutContext } from '../../../contexts/WorkoutContext'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import { amethyst } from '@codesandbox/sandpack-themes'
import { mergeFiles, mergeFilesAsOwner } from './utils'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { Box, Typography } from '@mui/material'
import ResizeHandle from '../../../components/ResizeHandle'
import Browser from './browser/Root'
import AutoSave from './components/AutoSave'
import Prettier from './components/Prettier'
import ChangedFiles from './components/ChangedFiles'

const EditorMain = ({ isSolution }) => {
  const codemirrorInstance = useRef()
  const { workout, setFromLocal } = useContext(WorkoutContext)

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
      files={
        workout.isOwner
          ? mergeFilesAsOwner(workout, isSolution)
          : mergeFiles(workout, isSolution, setFromLocal)
      }
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
      <SandpackThemeProvider theme={'dark'}>
        <SandpackLayout>
          <div className='editor-layout'>
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
                      <ResizeHandle horz={true} />
                      <Panel>
                        <Box className='source-control-wrapper'>
                          <Typography>SOURCE CONTROL</Typography>
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
                style={{ position: 'relative' }}
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
