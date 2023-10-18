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
import ReadOnlyEditor from '../read-only-editor/ReadOnlyEditor'

export const WorkoutContext = createContext({})

const Workout = () => {
  let { name } = useParams()
  const challenge = rows.filter((row) => row.name === name)[0]
  const [workoutState, setWorkoutState] = useState({
    challenge,
    showDemo: false,
    showInstructions: true,
  })

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
        {!workoutState.showDemo ? (
          <EditorMain files={getLocalStorage(challenge)} />
        ) : null}
        {workoutState.showDemo ? (
          <ReadOnlyEditor files={challenge.demo} />
        ) : null}
        <Instructions />
      </WorkoutContext.Provider>
    </Box>
  )
}

export default Workout
