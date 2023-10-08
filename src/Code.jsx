import { Sandpack } from '@codesandbox/sandpack-react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import rows from './problems/react'
import { Typography, Box } from '@mui/material'

const App = () => {
  const files = {}
  const navigate = useNavigate()
  let { filter, name } = useParams()

  const challenge = rows.filter((row) => row.name === name)[0]

  return (
    <>
      <ArrowBackIcon
        style={{ marginBottom: '10px', cursor: 'pointer' }}
        onClick={() => {
          navigate('/workouts/' + filter)
        }}
      />
      <Box mt={2} mb={4}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          {challenge.title}
        </Typography>
        <Typography ml={'20px'}>{challenge.description}</Typography>
      </Box>
      <Sandpack files={files} theme='dark' template='react' />
    </>
  )
}

export default App
