import { Typography } from '@mui/material'
import Header from '../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router'

const games = [
  {
    title: 'true or false',
    to: 'true-or-false',
    description: 'Test your understanding of JavaScript types and comparisons.',
  },
  {
    title: 'Will it throw?',
    to: 'will-it-throw',
    description: 'Determine if the provided code will throw an error.',
  },
]

const Games = ({ tab }) => {
  const navigate = useNavigate()
  return (
    <div className='fit-wrapper'>
      <Header
        title='Games'
        subtext="Some cool games I've made that will test your knowledge."
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {games.map((game, index) => {
          return (
            <div
              className='item-container'
              onClick={() => navigate(`/games/${game.to}`)}
            >
              <div>
                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
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
          )
        })}
      </div>
    </div>
  )
}

export default Games
