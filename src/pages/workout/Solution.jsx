/* eslint-disable operator-linebreak */
import { Fade, Box } from '@mui/material'
import { SandpackProvider } from '@codesandbox/sandpack-react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import EditorMain from '../../editor/EditorMain'
import { WorkoutContext } from './root/WorkoutContext'
import Workout from '../../models/workout'

const mergeFiles = (workout) => {
  const local =
    JSON.parse(localStorage.getItem(`${workout.id}-solution`)) ||
    workout.dynamoData.solution
  const shared =
    JSON.parse(localStorage.getItem(`${workout.id}-shared`)) ||
    workout.dynamoData.shared
  const packageJson =
    JSON.parse(localStorage.getItem(`${workout.id}-package.json`)) ||
    workout.dynamoData.packageJson

  return { ...local, ...shared, ...packageJson }
}

const Solution = () => {
  const { workoutData } = useContext(WorkoutContext)
  const workout = new Workout(workoutData)
  const navigate = useNavigate()

  let files

  try {
    files = mergeFiles(workout)
  } catch (error) {
    navigate('/workouts/official')
  }

  return (
    <Fade in timeout={1000}>
      <div>
        <Box sx={{ height: 'calc(100vh - 100px)' }}>
          <SandpackProvider
            files={files}
            template={
              workout.spTemplate.name === 'vanilla'
                ? 'static'
                : workout.spTemplate.name
            }
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
