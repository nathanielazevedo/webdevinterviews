import EditorMain from '../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import WorkoutContext from './WorkoutContext'
import { useContext } from 'react'

const Template = () => {
  const { workout } = useContext(WorkoutContext)
  let files
  try {
    const local = JSON.parse(localStorage.getItem(workout.id))
    files = local ? local.files : JSON.parse(workout.template)
  } catch (error) {
    files = {}
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
