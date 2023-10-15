/* eslint-disable react/prop-types */
import EditorMain from '../../code-editor/EditorMain'
import { useState } from 'react'

const Demo = ({ challenge }) => {
  const storedFiles = localStorage.getItem(challenge.name + '-demo')
  const [autoSave, setAutoSave] = useState(true)
  const whichFile = storedFiles
    ? JSON.parse(storedFiles)
    : challenge.template
    ? challenge.template
    : undefined

  const [files, setFiles] = useState(whichFile ? whichFile : {})
  return (
    <EditorMain
      demo={true}
      files={files}
      setFiles={setFiles}
      autoSave={autoSave}
      challenge={challenge}
      setAutoSave={setAutoSave}
    />
  )
}

export default Demo
