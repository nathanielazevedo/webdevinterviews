import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackThemeProvider,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import { WorkoutContext } from '../workouts/Workout'
import { theme } from '../editor/theme'
import ReadOnlyToolbar from './ReadOnlyToolbar'
import Footer from '../editor/Footer'
import { Box } from '@mui/material'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from '../components/ResizeHandle'

const ReadOnlyEditor = () => {
  const [workoutState] = useContext(WorkoutContext)
  return (
    <SandpackProvider
      files={workoutState.challenge.demo}
      template='react'
      options={{
        autoReload: true,
        visibleFiles: ['/App.js'],
      }}
    >
      <SandpackThemeProvider theme={theme}>
        <ReadOnlyToolbar />
        <SandpackLayout>
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
              <SandpackFileExplorer style={{ height: '100%' }} />
            </Panel>
            <ResizeHandle />
            <Panel
              minSize={0}
              collapsible={true}
              style={{ maxHeight: '96vh', minHeight: '96vh' }}
            >
              <SandpackCodeViewer
                showTabs
                showLineNumbers
                style={{ height: '100%' }}
              />
            </Panel>
            <ResizeHandle />
            <Panel minSize={0} collapsible={true}>
              <Box
                sx={{
                  height: '97vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <PanelGroup
                  autoSaveId='console'
                  direction='vertical'
                  disablePointerEventsDuringResize
                >
                  <Panel minSize={0}>
                    <Box sx={{ height: '100%' }}>
                      <SandpackPreview style={{ height: '100%' }} />
                    </Box>
                  </Panel>
                  <ResizeHandle />
                  <Panel minSize={10}>
                    <Box sx={{ height: '100%' }}>
                      <SandpackConsole />
                    </Box>
                  </Panel>
                </PanelGroup>
              </Box>
            </Panel>
          </PanelGroup>
        </SandpackLayout>
        <Footer />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default ReadOnlyEditor
