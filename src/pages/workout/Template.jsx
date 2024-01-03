import { Fade, Box } from '@mui/material'
import { useContext } from 'react'
import { SandpackProvider } from '@codesandbox/sandpack-react'
import EditorMain from '../../editor/EditorMain'
import { WorkoutContext } from './root/WorkoutContext'
import Workout from '../../models/workout'

const Template = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  // let files
  // try {
  //   const local = JSON.parse(localStorage.getItem(workout.id))
  //   const shared = JSON.parse(localStorage.getItem(`${workout.id}-shared`))
  //   files = local || workoutData.dynamo_data.template
  //   if (shared) {
  //     files = { ...files, ...shared }
  //   } else {
  //     files = { ...files, ...workoutData.dynamo_data.shared }
  //   }
  // } catch (error) {
  //   files = {}
  // }

  const files = {
    '/App.js': "console.log('Hello World')",
    '/shared/': {
      '/main.js': {
        code: "console.log('Hello World')",
      },
    },
  }

  return (
    <Fade in timeout={1000}>
      <div>
        <Box sx={{ height: 'calc(100vh - 100px)' }}>
          <SandpackProvider
            files={files}
            customSetup={{
              entry: '/App.js',
            }}
            options={{
              autoReload: true,
              autorun: true,
              activeFile: '/App.js',
              visibleFiles: ['/App.js'],
            }}
          >
            <EditorMain files={files} isSolution={false} />
          </SandpackProvider>
        </Box>
      </div>
    </Fade>
  )
}

export default Template
