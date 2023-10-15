import rows from './problems'
import WorkoutBody from './WorkoutBody'
import WorkoutHeader from './WorkoutHeader'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()
  let { filter, name } = useParams()
  const challenge = rows.filter((row) => row.name === name)[0]

  return (
    <>
      <WorkoutHeader
        challenge={challenge}
        navigate={navigate}
        filter={filter}
      />
      <WorkoutBody challenge={challenge} />
    </>
  )
}

export default App
