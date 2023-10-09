import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import rows from './problems/react'
import { Typography, Box, Button } from '@mui/material'
import Rating from './Rating'
import Code2 from './Code2'
import YouTubeIcon from '@mui/icons-material/YouTube'

const App = () => {
  const navigate = useNavigate()
  let { filter, name } = useParams()

  const challenge = rows.filter((row) => row.name === name)[0]

  return (
    <>
      <Box
        style={{
          display: 'flex',
          gap: '25px',
          alignItems: 'center',
        }}
      >
        <Button
          variant='contained'
          style={{ cursor: 'pointer', height: '30px' }}
          onClick={() => {
            navigate('/workouts/' + filter)
          }}
        >
          <ArrowBackIcon />
        </Button>

        <a
          href={challenge.link}
          target='_blank'
          rel='noreferrer'
          style={{
            display: 'flex',
            textDecoration: 'none',
            color: 'inherit',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <YouTubeIcon
            sx={{
              color: '#FF0000',
            }}
            style={{
              fontSize: '50px',
              height: '40px',
            }}
          />
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
            }}
          >
            {challenge.title}
          </Typography>
        </a>

        <Rating rating={challenge.difficulty} />
      </Box>
      <Typography mt={3} mb={3}>
        {challenge.description}
      </Typography>
      <Code2 />
    </>
  )
}

export default App
