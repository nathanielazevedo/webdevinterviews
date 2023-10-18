import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import { WorkoutContext } from '../workouts/Workout'
import { theme } from '../code-editor/theme'
import ReadOnlyToolbar from './ReadOnlyToolbar'
import Footer from '../code-editor/Footer'

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
          <SandpackPreview />
        </SandpackLayout>
        <Footer />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

export default ReadOnlyEditor
