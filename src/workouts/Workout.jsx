/* eslint-disable react/prop-types */
import rows from './problems'
import { Box } from '@mui/material'
import { createContext } from 'react'
import Instructions from './Instructions'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import EditorMain from '../code-editor/EditorMain'
import { getLocalStorage } from '../code-editor/utils'
import ReadOnlyEditor from '../read-only-editor/ReadOnlyEditor'

export const WorkoutContext = createContext({})

const Workout = () => {
  let { name } = useParams()
  const [key, setKey] = useState(0)
  const challenge = rows.filter((row) => row.name === name)[0]
  const [workoutState, setWorkoutState] = useState({
    challenge,
    reset: 0,
    showDemo: false,
    activeFile: '/App.js',
    visibleFiles: ['/App.js'],
    showTests: false,
    showInstructions: true,
  })

  // what is this doing?
  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [workoutState.reset])

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <WorkoutContext.Provider value={[workoutState, setWorkoutState]}>
        {!workoutState.showDemo ? (
          <EditorMain key={key} files={getLocalStorage(challenge)} />
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
