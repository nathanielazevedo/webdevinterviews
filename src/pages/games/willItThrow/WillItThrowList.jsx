// components
import { NavLink } from 'react-router-dom'
import decks from './willItThrow.json'
import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

const Games = () => {
  const navigate = useNavigate()
  return (
    <div className='fit-wrapper'>
      <TextLink
        to='/games'
        text='Back to games'
        icon={<ArrowBackIosIcon fontSize='5px' />}
      />
      <Header
        title='Choose a deck'
        subtext='Determine if the code provided will throw an error.'
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {decks.map((deck, index) => {
          return (
            <div
              className='item-container'
              onClick={() => navigate(`/games/will-it-throw/${deck.to}`)}
            >
              <div>
                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  {deck.title}
                </div>
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
