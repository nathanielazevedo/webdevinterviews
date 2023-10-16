/* eslint-disable react/prop-types */
import rows from './problems'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Instructions from './Instructions'
import { useParams } from 'react-router-dom'
import EditorMain from '../code-editor/EditorMain'

const Workout = () => {
  const [showInstructions, setShowInstructions] = useState(true)
  const [demo, setDemo] = useState(false)

  let { name } = useParams()
  const challenge = rows.filter((row) => row.name === name)[0]
  const tag = demo ? '-demo' : '-challenge'
  const storedFiles = localStorage.getItem(challenge.name + tag)
  const whichFile = storedFiles
    ? JSON.parse(storedFiles)
    : challenge.template
    ? challenge.template
    : undefined
  const [files, setFiles] = useState(whichFile ? whichFile : {})

  useEffect(() => {
    const whichFile = storedFiles
      ? JSON.parse(storedFiles)
      : demo && challenge.demo
      ? challenge.demo
      : challenge.template
      ? challenge.template
      : undefined
    setFiles(whichFile ? whichFile : {})
  }, [challenge.demo, challenge.template, demo, storedFiles])

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
        demo={demo}
        setDemo={setDemo}
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
