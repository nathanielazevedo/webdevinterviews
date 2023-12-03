/* eslint-disable react/prop-types */
import { theme } from './theme'
import AutoSave from './AutoSave'
import SpeedDial from './SpeedDial'
import Box from '@mui/material/Box'
import { useRef, useState } from 'react'
import ResizeHandle from '../../components/ResizeHandle'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import UploadIcon from '@mui/icons-material/Upload'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { IconButton, Tooltip } from '@mui/material'
import Browser from './browser'
import { AuthContext } from '../../pages/AuthContext'
import { useContext } from 'react'
import WorkoutContext from '../../pages/workout/WorkoutContext'
import UploadCodeDialog from './UploadCodeDialog'

const EditorMain = ({ files: initialFiles, isSolution }) => {
  const filePanelRef = useRef()
  const codemirrorInstance = useRef()
  const { workout } = useContext(WorkoutContext)
  const [showTests, setShowTests] = useState(false)
  const [uploadCodeDialogOpen, setUploadCodeDialogOpen] = useState(false)
  const [files, setFiles] = useState(initialFiles)
  // console.log(isSolution, files)
  const { isAdmin } = useContext(AuthContext)

  return (
    <Box
      sx={{
        border: '1px solid purple',
        minHeight: 'calc(99vh - 120px)',
        maxHeight: 'calc(99vh - 120px)',
      }}
    >
      <SandpackProvider
        files={files}
        template='react'
        customSetup={{
          dependencies: {
            'jest-extended': '^3.0.2',
            'react-router-dom': '^6.16.0',
          },
        }}
        options={{
          autoReload: true,
          activeFile: '/App.js',
          visibleFiles: ['/App.js'],
        }}
      >
        {!isSolution && (
          <AutoSave workout={workout} files={files} setFiles={setFiles} />
        )}
        <SandpackThemeProvider theme={theme}>
          <SandpackLayout>
            <div
              style={{
                width: '100%',
                minHeight: 'calc(99vh - 120px)',
                maxHeight: 'calc(99vh - 120px)',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                height: '50%',
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
                  style={{
                    position: 'relative',
                    minHeight: 'calc(99vh - 120px)',
                    maxHeight: 'calc(99vh - 120px)',
                  }}
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
                  {isAdmin && (
                    <IconButton
                      onClick={() => setUploadCodeDialogOpen(true)}
                      fontSize='large'
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '50px',
                        zIndex: '100',
                      }}
                    >
                      <UploadIcon />
                    </IconButton>
                  )}
                  {!isSolution && (
                    <Box>
                      <Tooltip title={<>Changes Saved.</>} placement='left'>
                        <Box
                          fontSize='large'
                          sx={{
                            position: 'absolute',
                            top: '13px',
                            right: '10px',
                            color: 'grey.600',
                            boxShadow: '0px 0px 2px 1px grey',
                            cursor: 'pointer',
                            backgroundColor: 'var(--green)',
                            opacity: '0.7',
                            height: '15px',
                            width: '15px',
                            borderRadius: '50%',
                            zIndex: '100',
                            ':hover': {
                              color: 'primary.main',
                            },
                          }}
                        ></Box>
                      </Tooltip>
                    </Box>
                  )}
                  {!isSolution && (
                    <SpeedDial
                      codemirrorInstance={codemirrorInstance}
                      workout={workout}
                      setShowTests={setShowTests}
                      showTests={showTests}
                    />
                  )}
                </Panel>
                <ResizeHandle />
                <Panel
                  minSize={0}
                  defaultSize={45}
                  collapsible={true}
                  style={{
                    position: 'relative',
                    minHeight: 'calc(99vh - 120px)',
                    maxHeight: 'calc(99vh - 120px)',
                  }}
                >
                  <Browser showTests={showTests} />
                </Panel>
              </PanelGroup>
            </div>
            {uploadCodeDialogOpen && (
              <UploadCodeDialog
                open={uploadCodeDialogOpen}
                setOpen={setUploadCodeDialogOpen}
              />
            )}
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </Box>
  )
}

export default EditorMain
