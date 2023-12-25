/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { useRef, useState, useContext } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import UploadIcon from '@mui/icons-material/Upload'
import { IconButton } from '@mui/material'
import ResizeHandle from '../ResizeHandle'
import Browser from './browser'
import SpeedDial from './SpeedDial'
import AutoSave from './AutoSave'
import { theme } from './theme'
import WorkoutContext from '../../pages/workout/root/WorkoutContext'
import UploadCodeDialog from './UploadCodeDialog'
import Workout from '../../models/workout'

const EditorMain = ({ files: initialFiles, isSolution }) => {
  const filePanelRef = useRef()
  const codemirrorInstance = useRef()
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  const [showTests, setShowTests] = useState(false)
  const [uploadCodeDialogOpen, setUploadCodeDialogOpen] = useState(false)
  const [files, setFiles] = useState(initialFiles)

  // if owner always render AutoSave
  // if not owner and not solution render AutoSave
  // if solution and owner render AutoSave
  // if solution and not owner don't render AutoSave

  const renderAutoSave = () => {
    if (workoutData.is_owner) {
      return true
    }
    if (!isSolution) {
      return true
    }
    return false
  }

  return (
    <>
      {renderAutoSave() && (
        <AutoSave
          workout={workout}
          files={files}
          setFiles={setFiles}
          isSolution={isSolution}
        />
      )}

      <SandpackThemeProvider theme={theme}>
        <SandpackLayout>
          <div
            style={{
              width: '100%',
              // minHeight: 'calc(99vh - 120px)',
              // maxHeight: 'calc(99vh - 120px)',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              height: '100%',
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
                collapsible
                ref={filePanelRef}
              >
                <SandpackFileExplorer />
              </Panel>
              <ResizeHandle />
              <Panel
                minSize={0}
                defaultSize={40}
                collapsible
                style={{
                  position: 'relative',
                }}
              >
                <SandpackCodeEditor
                  showTabs
                  closableTabs
                  showLineNumbers
                  showInlineErrors
                  showRunButton
                  wrapContent
                  ref={codemirrorInstance}
                  style={{ height: '100%' }}
                />
                {workoutData.is_owner && (
                  <IconButton
                    onClick={() => setUploadCodeDialogOpen(true)}
                    fontSize='small'
                    sx={{
                      position: 'absolute',
                      top: '0px',
                      right: '5px',
                      zIndex: '100',
                      color: 'primary.main',
                    }}
                  >
                    <UploadIcon fontSize='small' />
                  </IconButton>
                )}
                {/* {!isSolution && (
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
                        />
                      </Tooltip>
                    </Box>
                  )} */}
                {renderAutoSave() && (
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
                collapsible
                style={{
                  position: 'relative',
                }}
              >
                <Browser showTests={showTests} files={files} />
              </Panel>
            </PanelGroup>
          </div>
          {uploadCodeDialogOpen && (
            <UploadCodeDialog
              open={uploadCodeDialogOpen}
              setOpen={setUploadCodeDialogOpen}
              isSolution={isSolution}
            />
          )}
        </SandpackLayout>
      </SandpackThemeProvider>
    </>
  )
}

export default EditorMain
