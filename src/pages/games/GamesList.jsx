import { Typography } from '@mui/material'
import Header from '../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router'
import Footer from '../../components/Footer'
import LockIcon from '@mui/icons-material/Lock'

const games = [
  {
    title: 'True or False',
    to: 'true-or-false',
    description: 'Test your understanding of JavaScript types and comparisons.',
    visible: true,
  },
  {
    title: 'Will It Throw',
    to: 'will-it-throw',
    description: 'Determine if the provided code will throw an error.',
    visible: true,
  },
  {
    title: 'Does It Mutate',
    to: '',
    description: 'Does the code mutate or create a new array?',
    visible: false,
  },
  {
    title: 'Choose Correct Comparison Operator',
    to: '',
    description: 'You choose the correct comparison operator. > < == ===',
    visible: false,
  },
  {
    title: 'Returns What?',
    to: '',
    description: 'Predict the returned value.',
    visible: false,
  },
  {
    title: 'Small DSA',
    to: '',
    description: 'DSA, but small.',
    visible: false,
  },
  {
    title: 'SQL Squeal',
    to: '',
    description: 'How well do you know SQL?',
    visible: false,
  },
]

const GamesList = ({ tab }) => {
  const navigate = useNavigate()
  return (
    <>
      <div className='fit-wrapper'>
        <Header
          title='Games'
          subtext="Some cool games I've made that will test your knowledge."
        />
        <div>
          {games.map((game, index) => {
            return game.visible ? (
              <div
                key={index}
                className='item-container'
                onClick={() => navigate(`/games/${game.to}`)}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    {game.title}
                  </div>
                  <Typography sx={{ color: 'grey.500' }}>
                    {game.description}
                  </Typography>
                </div>
                <ArrowForwardIosIcon
                  sx={{
                    color: 'grey.400',
                  }}
                />
              </div>
            ) : (
              <div className='hidden-item-wrapper' key={game.id}>
                <div className='hidden-item-overlay'></div>
                <div key={index} className='item-container'>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      {game.title}
                    </div>
                    <Typography sx={{ color: 'grey.500' }}>
                      {game.description}
                    </Typography>
                  </div>
                  <LockIcon sx={{ color: 'grey.400' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GamesList
