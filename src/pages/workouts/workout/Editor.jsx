import EditorMain from '../../../components/editor/EditorMain'
import { Fade } from '@mui/material'

const Editor = () => {
  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain />
      </div>
    </Fade>
  )
}

export default Editor
