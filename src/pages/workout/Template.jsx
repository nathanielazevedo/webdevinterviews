import EditorMain from '../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import EditorContext from './EditorContext'
import { useContext } from 'react'

const Template = () => {
  const { workout } = useContext(EditorContext)
  let files
  try {
    const local = JSON.parse(localStorage.getItem(workout.id))
    files = local ? local.files : workout.template
  } catch (error) {
    console.error(`Failed to parse JSON: ${error.message}`)
    files = {} // Default value in case of error
  }

  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain files={files} isSolution={false} />
      </div>
    </Fade>
  )
}

export default Template
