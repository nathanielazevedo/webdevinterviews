/* eslint-disable react/prop-types */
import rows from './problems'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Instructions from './tabs/Instructions'
import EditorMain from '../code-editor/EditorMain'

const Workout = () => {
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
    <>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          className='component'
          style={{
            width: '97vw',
            height: '97vh',
            border: 'solid var(--color-solid-resize-bar) 0.5px',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <EditorMain files={files} setFiles={setFiles} challenge={challenge} />
          <Instructions challenge={challenge} />
        </div>
      </div>
    </>
  )
}

export default Workout
