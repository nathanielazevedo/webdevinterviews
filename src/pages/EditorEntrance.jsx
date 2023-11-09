/* eslint-disable react/prop-types */
import rows from '../workouts'
import { Box } from '@mui/material'
import { createContext } from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import EditorMain from '../editors/editor'
import { getLocalStorage } from '../editors/editor/utils'
import ReadOnlyEditor from '../editors/read-only-editor/ReadOnlyEditor'

// This page should be callled EditorEntrance
// This page should do some calculations to determine what type of editor to render

export const WorkoutContext = createContext({})

const EditorEntrance = () => {
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
      }}
    >
      <WorkoutContext.Provider value={[workoutState, setWorkoutState]}>
        {!workoutState.showDemo ? (
          <EditorMain key={key} files={getLocalStorage(challenge)} />
        ) : null}
        {workoutState.showDemo ? (
          <ReadOnlyEditor files={challenge.demo} />
        ) : null}
      </WorkoutContext.Provider>
    </Box>
  )
}

export default EditorEntrance
