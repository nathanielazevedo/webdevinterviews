import { Typography } from '@mui/material'
import Header from '../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router'

const games = [
  {
    title: 'To be announced.',
    to: '',
    description:
      'Subscribe to my youtube channel to get notified when the next contest starts.',
  },
]

const ContestsList = ({ tab }) => {
  const navigate = useNavigate()
  return (
    <div className='fit-wrapper'>
      <Header
        title='Contests'
        subtext='Win prizes by being the first to complete a challenge.'
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
              key={index}
              className='item-container'
              // onClick={() => navigate(`/games/${game.to}`)}
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

export default ContestsList
