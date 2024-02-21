import Box from '@mui/material/Box'
import { Fade, Typography, colors, Button, Divider } from '@mui/material'
import { YouTube } from '@mui/icons-material'
import Card from '../components/Card'
import featureCards from '../components/marketing/featuresCards'
import TrueOrFalse from '../pages/games/trueOrFalse/TrueOrFalse'
import live from '../assets/live.png'
import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  return (
    <Fade in timeout={1000}>
      <div className='fit-wrapper'>
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            WEB DEV INTERVIEWS
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            The best learning is done when you are engaged with the material. On
            this site you can play games, complete workouts and enter
            competitions; all while becoming a better programmer.
          </Typography>
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            GAMES
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            JavaScript is tricky. These games will expose you to concepts you
            maybe hadn't thought of.
          </Typography>
          <Button
            size='large'
            onClick={() => navigate('/games')}
            variant='outlined'
            fullWidth
            className='marketing-button'
          >
            Play
          </Button>
          <TrueOrFalse />
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            WORKOUTS
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            Being a programmer is like being an athlete of the mind, you need to
            workout.
          </Typography>
          <Button
            size='large'
            onClick={() => navigate('/workouts')}
            variant='outlined'
            fullWidth
            className='marketing-button'
          >
            Workout
          </Button>
          <img src={live} style={{ marginTop: '30px' }} />
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            Contests
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            I take my YouTube advertising money and give it away in coding
            challenges. Subscribe to channel to get notified when a new contest
            is released.
          </Typography>
          <a
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw'
            target='_blank'
          >
            <Button
              size='large'
              variant='outlined'
              fullWidth
              className='marketing-button'
            >
              Go To Youtube
            </Button>
          </a>
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            YouTube
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            I make an in-depth video for every workout. You might also enjoy my
            shorts where I play games.
          </Typography>
          <a
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw'
            target='_blank'
          >
            <Button
              size='large'
              variant='outlined'
              fullWidth
              className='marketing-button'
            >
              Go To Youtube
            </Button>
          </a>
        </div>
      </div>
    </Fade>
  )
}

export default Home
