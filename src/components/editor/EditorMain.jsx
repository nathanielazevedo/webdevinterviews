/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { useRef, useState, useContext } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { SandpackFileExplorer } from 'sandpack-file-explorer'
import {
  SandpackLayout,
  SandpackCodeEditor,
  SandpackThemeProvider,
  useSandpack,
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

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true
  }

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

function areDataSetsDifferent(dataSet1, dataSet2) {
  return !deepEqual(dataSet1, dataSet2)
}

const handleSharedFiles = (files) => {
  const sharedFiles = {}
  const otherFiles = {}

  Object.keys(files).forEach((key) => {
    if (key.startsWith('/shared')) {
      sharedFiles[key] = files[key]
    } else if (key !== '/package.json') {
      otherFiles[key] = files[key]
    }
  })
  return { sharedFiles, otherFiles }
}

const EditorMain = ({ files: initialFiles, isSolution }) => {
  const filePanelRef = useRef()
  const codemirrorInstance = useRef()
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  const [showTests, setShowTests] = useState(false)
  const [uploadCodeDialogOpen, setUploadCodeDialogOpen] = useState(false)
  const [files, setFiles] = useState(initialFiles)
  const { sandpack } = useSandpack()
  const { sharedFiles, otherFiles } = handleSharedFiles(sandpack.files)
  const diffFiles = isSolution
    ? workoutData.dynamo_data.solution
    : workoutData.dynamo_data.template
  const { otherFiles: otherFiles2 } = handleSharedFiles(diffFiles)

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

  // useEffect(() => {
  //   const cmInstance = codemirrorInstance.current.getCodemirror()
  //   if (!cmInstance) return
  // }, [])

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
                  // extensions={[linter(), closeBrackets()]}
                  style={{ height: '100%' }}
                />
                {workoutData.is_owner &&
                  areDataSetsDifferent(otherFiles, otherFiles2) && (
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
