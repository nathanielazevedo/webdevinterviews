/* eslint-disable react/prop-types */
import EditorMain from '../../code-editor/EditorMain'
import { useState } from 'react'

const Demo = ({ challenge }) => {
  const [files, setFiles] = useState(challenge.demo)
  return (
    <EditorMain
      demo={true}
      files={files}
      setFiles={setFiles}
      challenge={challenge}
    />
  )
}

export default Demo
