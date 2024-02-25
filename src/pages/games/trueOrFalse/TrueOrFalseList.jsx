import { NavLink } from 'react-router-dom'
import decks from './trueOrFalse.json'
import { Box, Typography } from '@mui/material'
import TextLink from '../../../components/TextLink'
import Header from '../../../components/Header'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Footer from '../../../components/Footer'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import LockIcon from '@mui/icons-material/Lock'

const Games = () => {
  const navigate = useNavigate()
  const { displayName } = useContext(AuthContext)
  decks.forEach((deck) => {
    if (displayName) {
      deck.public = true
    }
  })

  return (
    <>
      <div className='fit-wrapper'>
        <TextLink
          to='/games'
          text='Back to games'
          icon={<ArrowBackIosIcon fontSize='5px' />}
        />
        <Header
          title='Choose a deck'
          subtext='Test your understanding of JavaScript types and comparisons.'
        />
        <div>
          {decks.map((deck, index) => {
            return deck.public ? (
              <div
                className='item-container'
                onClick={() => navigate(`/games/true-or-false/${deck.to}`)}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
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
            ) : (
              <div className='hidden-item-wrapper'>
                <div className='hidden-item-overlay'></div>
                <div
                  className='item-container'
                  onClick={() => navigate(`/games/true-or-false/${deck.to}`)}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      {deck.title}
                    </div>
                  </div>
                  <LockIcon
                    sx={{
                      color: 'grey.400',
                    }}
                  />
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

export default Games
