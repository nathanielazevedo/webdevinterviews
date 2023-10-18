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
import { theme } from '../code-editor/theme'
import ReadOnlyToolbar from './ReadOnlyToolbar'
import Footer from '../code-editor/Footer'
import { Box } from '@mui/material'

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
          <SandpackFileExplorer />
          <SandpackCodeViewer />
          <Box
            sx={{
              width: '40%',
              height: '97vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                height: '55vh',
              }}
            >
              <SandpackPreview
                style={{
                  height: '100%',
                }}
              />
            </Box>
            <Box
              sx={{
                height: '39vh',
              }}
            >
              <SandpackConsole />
            </Box>
          </Box>
        </SandpackLayout>
        <Footer />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default ReadOnlyEditor
