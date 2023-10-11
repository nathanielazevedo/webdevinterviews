import Tabs from './WorkoutTabs'
import rows from './problems'
import Rating from '../components/Rating'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Typography, Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

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
        <Button>
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
          </a>
        </Button>
      </Box>
      <Tabs challenge={challenge} />
    </>
  )
}

export default App
