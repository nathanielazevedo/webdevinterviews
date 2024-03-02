import Box from '@mui/material/Box'
import { Fade, Typography, colors, Button, Divider } from '@mui/material'
import { YouTube } from '@mui/icons-material'
import TrueOrFalse from '../pages/games/trueOrFalse/TrueOrFalse'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Rating from '../components/Rating'
import Will_ItThrow from './games/willItThrow/WillItThrow'
import Modal from '../components/Modal'
import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const workouts = [
  {
    description: 'Improve the re-rendering of this component.',
    difficulty: 'junior',
    id: 15,
    public: true,
    sp_template: 'react',
    title: 'Optimize React Rerenders',
    visible: true,
    youtube_link: 'https://youtu.be/MabHyCR8mHY',
  },
  {
    description: 'Fetch, render, sort, filter. This ones tough.',
    difficulty: 'senior',
    id: 22,
    public: true,
    sp_template: 'react',
    title: 'Build a table with functionality.',
    visible: true,
    youtube_link: 'https://youtu.be/EgLIblcyLpM',
  },
  {
    description: 'Good luck. This will take a while.',
    difficulty: 'senior',
    id: 40,
    public: true,
    sp_template: 'react',
    title: 'Checked Tree',
    visible: true,
    youtube_link: 'https://youtu.be/WX8Oplyd3Ag',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)
  const [bannerOpen, setBannerOpen] = useState(displayName ? false : true)

  const closeBanner = () => {
    setBannerOpen(false)
  }
  return (
    <>
      <div className='fit-wrapper'>
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            WEB DEV INTERVIEWS
          </Typography>
          <Typography variant='h6' color={'grey.300'} textAlign={'left'}>
            Learning hinges on capturing your brain's interest. Through the use
            of games, dynamic workouts, and engaging contests, I strive to
            inspire continuous exploration and learning.
          </Typography>
          <div className='home-buttons'>
            <Button
              variant='outlined'
              onClick={() => navigate('/workouts')}
              size='large'
              fullWidth
              sx={{
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              15+ WORKOUTS
            </Button>
            <Button
              variant='outlined'
              onClick={() => navigate('/games')}
              fullWidth
              size='large'
              sx={{
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              50+ GAMES
            </Button>
            <Button
              variant='outlined'
              href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
              target='_blank'
              fullWidth
              size='large'
              sx={{
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              50+ Videos
            </Button>
          </div>
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            TRUE OR FALSE
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            Exercise your understanding of JavaScript comparison operators, type
            coercion and so much more.
          </Typography>

          <Button
            onClick={() => navigate('/games/true-or-false')}
            variant='outlined'
            size='large'
            sx={{
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className='marketing-button'
          >
            Play True or False
          </Button>
          <TrueOrFalse />
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            WILL IT THROW
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            JavaScript doesn't like to throw errors but it is very important to
            know when it will. This game will test your understanding of
            JavaScript error handling.
          </Typography>

          <Button
            onClick={() => navigate('/games/will-it-throw')}
            variant='outlined'
            size='large'
            sx={{
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className='marketing-button'
          >
            Play Will It Throw
          </Button>
          <Will_ItThrow />
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            WORKOUTS
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            A programmer is an athlete of the mind. An athlete workouts out
            their body; a programmer workouts out their mind.
          </Typography>
          <Button
            onClick={() => navigate('/workouts')}
            variant='outlined'
            size='large'
            sx={{
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className='marketing-button'
          >
            Go to Workouts
          </Button>
          <div>
            {workouts.map((workout) => {
              return (
                <div
                  key={workout.id}
                  className='item-container'
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                >
                  <div>
                    <div className='item-text-wrapper'>
                      <Typography>{workout.title}</Typography>
                      <Rating rating={workout.difficulty} />
                    </div>
                    <Typography sx={{ color: 'grey.500' }}>
                      {workout.description}
                    </Typography>
                  </div>
                  <ArrowForwardIosIcon sx={{ color: 'grey.400' }} />
                </div>
              )
            })}
          </div>
        </div>
        <Divider />
        <div className='marketing-section'>
          <Typography variant='h3' color={'grey.500'}>
            BECOME A MEMBER
          </Typography>
          <Typography variant='h6' color={'grey.300'}>
            Members of my YouTube channel get all access to workouts, True or
            False, and Will It Throw games. It costs 0.99&#162; / month. Your
            support allows me to improve my content and continue to produce cool
            stuff.
          </Typography>

          <Button
            variant='outlined'
            href='https://www.youtube.com/channel/UC-4Ij6StciJgYzbxLyxHMPw/join'
            target='_blank'
            size='large'
            sx={{
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className='marketing-button'
          >
            Become a member
          </Button>
        </div>
      </div>
      <Modal bannerOpen={bannerOpen} setBannerOpen={setBannerOpen} />
      <Footer bannerOpen={bannerOpen} />
    </>
  )
}

export default Home
