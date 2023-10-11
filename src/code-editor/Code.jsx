import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import rows from './problems/react'
import { Typography, Box, Button } from '@mui/material'
import Rating from '../components/Rating'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Tabs from '../WorkoutTabs'

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
        {/* <img
          src='https://img.youtube.com/vi/DhF1SJ5WUlY/0.jpg'
          width='100px'
          style={{ border: 'solid white 1px', borderRadius: '20px' }}
        /> */}
      </Box>
      <Tabs challenge={challenge} />
    </>
  )
}

export default App
