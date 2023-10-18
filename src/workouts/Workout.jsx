/* eslint-disable react/prop-types */
import rows from './problems'
import { Box } from '@mui/material'
import Instructions from './Instructions'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import EditorMain from '../code-editor/EditorMain'
import { getLocalStorage } from '../code-editor/utils'
import { createContext } from 'react'
import { RenderCounter } from '../components/RenderCount'

export const WorkoutContext = createContext({})

const Workout = () => {
  let { name } = useParams()

  const challenge = rows.filter((row) => row.name === name)[0]
  const showDemo = false
  const showInstructions = true
  const files = getLocalStorage(challenge)
  const context = {
    files,
    showDemo,
    challenge,
    unSavedFiles: [],
    showInstructions,
  }

  const [workoutState, setWorkoutState] = useState(context)
  console.log('Workout State', workoutState)

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <RenderCounter name={'Workout'} />
      <WorkoutContext.Provider value={[workoutState, setWorkoutState]}>
        <EditorMain />
        <Instructions />
      </WorkoutContext.Provider>
    </Box>
  )
}

export default Workout
