import EditorMain from '../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import WorkoutContext from './WorkoutContext'
import { useContext } from 'react'

const Template = () => {
  const { workout } = useContext(WorkoutContext)
  console.log(workout.template)
  let files
  try {
    const local = JSON.parse(localStorage.getItem(workout.id))
    console.log('local', local)
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
