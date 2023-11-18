import EditorMain from '../../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import EditorContext from './EditorContext'
import { useContext } from 'react'

const Editor = () => {
  const { workout } = useContext(EditorContext)
  console.log(workout)
  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain files={JSON.parse(workout.solution)} isSolution={true} />
      </div>
    </Fade>
  )
}

export default Editor
