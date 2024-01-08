/* eslint-disable operator-linebreak */
import { Fade, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SandpackProvider } from '@codesandbox/sandpack-react'
import EditorMain from '../../editor/EditorMain'
import { WorkoutContext } from './root/WorkoutContext'
import Workout from '../../models/workout'

const config = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // Add your project-specific rules here
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    // Additional rules...
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

const mergeFiles = (workout) => {
  const local =
    JSON.parse(localStorage.getItem(workout.id)) || workout.dynamoData.template
  const shared =
    JSON.parse(localStorage.getItem(`${workout.id}-shared`)) ||
    workout.dynamoData.shared
  const packageJson =
    JSON.parse(localStorage.getItem(`${workout.id}-package.json`)) ||
    workout.dynamoData.packageJson

  return { ...local, ...shared, ...packageJson }
}

const Template = () => {
  const { workoutData } = useContext(WorkoutContext)
  const navigate = useNavigate()
  const workout = new Workout(workoutData)
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
            template={workout.spTemplate.name}
            options={{
              autoReload: true,
              autorun: true,
              visibleFiles: ['/App.js'],
              activeFile: '/App.js',
            }}
          >
            <EditorMain isSolution={false} />
          </SandpackProvider>
        </Box>
      </div>
    </Fade>
  )
}

export default Template
