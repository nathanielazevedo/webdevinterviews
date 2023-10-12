/* eslint-disable react/prop-types */
import EditorMain from '../../code-editor/EditorMain'
import { useState } from 'react'

const Code = ({ challenge }) => {
  const storedFiles = localStorage.getItem(challenge.id)
  const whichFile = storedFiles
    ? JSON.parse(storedFiles)
    : challenge.template
    ? challenge.template
    : undefined

  const [files, setFiles] = useState(whichFile ? whichFile : {})

  return <EditorMain files={files} setFiles={setFiles} challenge={challenge} />
}

export default Code
