/* eslint-disable react/prop-types */
import rows from './problems'
import { useState } from 'react'
import { Box } from '@mui/material'
import Instructions from './Instructions'
import { useParams } from 'react-router-dom'
import EditorMain from '../code-editor/EditorMain'

const Workout = () => {
  const [showInstructions, setShowInstructions] = useState(true)

  let { name } = useParams()
  const challenge = rows.filter((row) => row.name === name)[0]
  const storedFiles = localStorage.getItem(challenge.name + '-challenge')
  const whichFile = storedFiles
    ? JSON.parse(storedFiles)
    : challenge.template
    ? challenge.template
    : undefined
  const [files, setFiles] = useState(whichFile ? whichFile : {})

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <EditorMain
        files={files}
        setFiles={setFiles}
        challenge={challenge}
        setShowInstructions={setShowInstructions}
      />
      <Instructions
        challenge={challenge}
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
      />
    </Box>
  )
}

export default Workout
