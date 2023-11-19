import EditorMain from '../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import EditorContext from './EditorContext'
import { useContext } from 'react'

const Solution = () => {
  const { workout } = useContext(EditorContext)

  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain files={workout.solution} isSolution={true} />
      </div>
    </Fade>
  )
}

export default Solution
