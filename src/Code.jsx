import { Sandpack } from '@codesandbox/sandpack-react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import rows from './problems/react'
import { Typography, Box, Button } from '@mui/material'

const App = () => {
  const files = {}
  const navigate = useNavigate()
  let { filter, name } = useParams()

  const challenge = rows.filter((row) => row.name === name)[0]

  return (
    <>
      <Button
        variant='contained'
        style={{ cursor: 'pointer' }}
        onClick={() => {
          navigate('/workouts/' + filter)
        }}
      >
        <ArrowBackIcon />
      </Button>
      <Box mt={4} mb={4}>
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
