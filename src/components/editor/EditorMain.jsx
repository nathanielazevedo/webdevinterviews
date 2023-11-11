/* eslint-disable react/prop-types */
import Browser from './Browser'
import { theme } from './theme'
import AutoSave from './AutoSave'
import SpeedDial from './SpeedDial'
import Box from '@mui/material/Box'
import { useRef, useState } from 'react'
import GifIcon from '@mui/icons-material/Gif'
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
import { Tooltip } from '@mui/material'

const EditorMain = () => {
  const filePanelRef = useRef()
  const codemirrorInstance = useRef()
  const { files, mode, workout } = useLoaderData()
  const [showTests, setShowTests] = useState(false)

  return (
    <>
      <SandpackProvider
        files={files}
        template='react'
        customSetup={{ dependencies: { 'jest-extended': '^3.0.2' } }}
        options={{
          autoReload: true,
          activeFile: '/App.js',
          visibleFiles: ['/App.js'],
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
                  <Box>
                    <Tooltip
                      title={
                        <>
                          {workout.gif && (
                            <img
                              src={workout.gif}
                              alt={workout.name}
                              style={{ maxWidth: '200px' }}
                            />
                          )}
                        </>
                      }
                      placement='bottom-end'
                    >
                      <GifIcon
                        fontSize='large'
                        sx={{
                          position: 'absolute',
                          top: '3px',
                          right: '0px',
                          color: 'grey.600',
                          cursor: 'pointer',
                          zIndex: '100',
                          ':hover': {
                            color: 'primary.main',
                          },
                        }}
                        onClick={() => setShowTests(!showTests)}
                      />
                    </Tooltip>
                  </Box>
                  {mode === 'template' && (
                    <SpeedDial
                      codemirrorInstance={codemirrorInstance}
                      workout={workout}
                      setShowTests={setShowTests}
                      showTests={showTests}
                    />
                  )}
                </Panel>
                <ResizeHandle />
                <Panel minSize={0} defaultSize={45} collapsible={true}>
                  <Browser showTests={showTests} />
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
