import EditorMain from '../../components/editor/EditorMain'
import { Fade } from '@mui/material'
import WorkoutContext from './WorkoutContext'
import { useContext } from 'react'

const Solution = () => {
  const { workout } = useContext(WorkoutContext)
  console.log(workout.solution)
  return (
    <Fade in={true} timeout={1000}>
      <div>
        <EditorMain files={workout.solution} isSolution={true} />
      </div>
    </Fade>
  )
}

export default Solution
