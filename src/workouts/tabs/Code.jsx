/* eslint-disable react/prop-types */
import EditorMain from '../../code-editor/EditorMain'
import { useState } from 'react'

const Code = ({ challenge }) => {
  const storedFiles = localStorage.getItem(challenge.id) ?? undefined
  const [files, setFiles] = useState(storedFiles ? JSON.parse(storedFiles) : {})

  return <EditorMain files={files} setFiles={setFiles} challenge={challenge} />
}

export default Code
