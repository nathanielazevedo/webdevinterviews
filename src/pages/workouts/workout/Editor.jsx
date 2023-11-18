import EditorMain from '../../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import EditorContext from './EditorContext'
import { useContext } from 'react'

const Editor = () => {
  const { workout } = useContext(EditorContext)
  const local = JSON.parse(localStorage.getItem(workout.id))
  const files = local ? local.files : JSON.parse(workout.template)

  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain files={files} isSolution={false} />
      </div>
    </Fade>
  )
}

export default Editor
