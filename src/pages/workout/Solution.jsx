import { Fade, Box } from '@mui/material'
import { SandpackProvider } from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import EditorMain from '../../components/editor/EditorMain'
import WorkoutContext from './root/WorkoutContext'
import Workout from '../../models/workout'

const Solution = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)

  return (
    <Fade in timeout={1000}>
      <div>
        <Box sx={{ height: 'calc(100vh - 100px)' }}>
          <SandpackProvider
            files={workoutData.dynamo_data.solution}
            template={workout.spTemplate.name}
            customSetup={{
              dependencies: workout.dependencies ?? {},
            }}
            options={{
              autoReload: true,
              activeFile: '/Instructions.txt',
              visibleFiles: ['/Instructions.txt'],
            }}
          >
            <EditorMain files={{}} isSolution />
          </SandpackProvider>
        </Box>
      </div>
    </Fade>
  )
}

export default Solution
